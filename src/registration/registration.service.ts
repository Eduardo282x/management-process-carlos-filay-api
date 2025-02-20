import { Injectable } from '@nestjs/common';
import { Grades, Registration } from '@prisma/client';
import { badResponse, baseResponse } from 'src/dtos/base.dto';
import { CreateRegistrationDto } from 'src/dtos/registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class RegistrationService {

    constructor(private prisma: PrismaService) { }

    async createRegistration(createRegistrationDto: CreateRegistrationDto) {
        const { student, payment, parents } = createRegistrationDto;

        // Begin a transaction
        return await this.prisma.$transaction(async (tx) => {
            const findStudent = await tx.students.findFirst({
                where: { identify: student.identify }
            })

            let studentId: number = 0;

            if (findStudent) {
                await tx.students.update({
                    data: {
                        age: Number(student.age),
                        gradeId: student.gradeId,
                        address: student.address,
                    },
                    where: {
                        id: findStudent.id
                    }
                });

                studentId = findStudent.id;
            } else {
                // Create student
                const createdStudent = await tx.students.create({
                    data: {
                        firstName: student.firstName,
                        lastName: student.lastName,
                        identify: student.identify,
                        age: Number(student.age),
                        gradeId: student.gradeId,
                        address: student.address,
                        status: true,
                    },
                });

                studentId = createdStudent.id
            }


            // Create parents
            const parentPromises = parents.map(async (parent) => {
                const findParent = await tx.parents.findFirst({
                    where: { identify: parent.identify }
                })

                if (findParent) {
                    return tx.parents.update({
                        data: {
                            age: parent.age,
                            phone: parent.phone,
                            address: parent.address,
                        },
                        where: {
                            id: findParent.id
                        }
                    })
                } else {
                    return tx.parents.create({
                        data: {
                            firstName: parent.firstName,
                            lastName: parent.lastName,
                            identify: parent.identify,
                            age: parent.age,
                            phone: parent.phone,
                            address: parent.address,
                            status: true,
                        },
                    })
                }
            });

            const createdParents = await Promise.all(parentPromises);

            // Link parents to student
            for (const parent of createdParents) {
                await tx.studentParent.create({
                    data: {
                        studentId: studentId,
                        parentId: parent.id,
                    },
                });
            }

            // Create payment
            const createdPayment = await tx.payments.create({
                data: {
                    amount: payment.amount,
                    studentId: studentId,
                    currency: payment.currency,
                    datePay: new Date(),
                    namePayer: payment.ownerName,
                    lastNamePayer: payment.ownerLastname,
                    identifyPayer: payment.identify,
                    phonePayer: payment.phone,
                    paymentMethodId: payment.paymentMethodId,
                },
            });

            const registerMonthlyFeePayment = await tx.monthlyPayment.create({
                data: {
                    studentId: studentId,
                    monthlyFeeId: new Date().getMonth() + 1,
                    status: false,
                },
            });

            // Create registration
            await tx.registration.create({
                data: {
                    studentId: studentId,
                    startDate: new Date(),
                    period: payment.period,
                    gradesId: student.gradeId,
                    paymentId: createdPayment.id,
                },
            });

            baseResponse.message = 'Estudiante inscrito exitosamente.'
            return baseResponse
        });
    }

    async getGrades(): Promise<Grades[]> {
        return await this.prisma.grades.findMany();
    }

    async getInscriptions(): Promise<Registration[]> {
        return await this.prisma.registration.findMany({
            include: {
                student: true,
                Grades: true,
                payments: true
            }
        });
    }

    async generateStudentRegistrationReport(studentId: number, res: Response) {
        const registration = await this.prisma.registration.findFirst({
            where: { studentId },
            include: {
                student: {
                    include: {
                        grade: true,
                        Parents: {
                            include: {
                                parent: true,
                            },
                        },
                    },
                },
                Grades: true,
                payments: true,
            },
        });

        if (!registration) {
            badResponse.message = `No se encontró inscripción para el estudiante con ID ${studentId}`
            return badResponse;
        }

        // Crear PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=inscripcion_${studentId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        const imagePath = path.join(__dirname, '../assets/logoColegio.jpg',);
        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, 250, 30, { width: 100 }); // Posición (x, y) y tamaño
        } else {
            console.log(`No existe ${imagePath}`);
        }

        // Título
        doc.moveDown(10);
        // **Encabezado**
        doc.fontSize(20).text(`Reporte de Inscripción`, { align: 'center' }).moveDown();

        // **Datos del Estudiante**
        doc.fontSize(14).text(`Información del Estudiante`, { underline: true }).moveDown();
        doc.text(`Nombre: ${registration.student.firstName} ${registration.student.lastName}`);
        doc.text(`Cédula: ${formatNumberWithDots(registration.payments.identifyPayer, 'V-', '')}`);
        doc.text(`Edad: ${registration.student.age}`);
        doc.text(`Dirección: ${registration.student.address}`);
        doc.text(`Grado: ${registration.Grades.grade}`);
        doc.text(`Período: ${registration.period}`);
        doc.text(`Fecha de inscripción: ${new Date(registration.startDate).toLocaleDateString()}`);
        doc.moveDown(2);

        // **Datos de los Padres**
        doc.fontSize(14).text(`Información de los Padres`, { underline: true }).moveDown();
        registration.student.Parents.forEach(({ parent }) => {
            doc.text(`Nombre: ${parent.firstName} ${parent.lastName}`);
            doc.text(`Cédula: ${formatNumberWithDots(registration.payments.identifyPayer, 'V-', '')}`);
            doc.text(`Teléfono: ${parent.phone}`);
            doc.text(`Dirección: ${parent.address}`);
            doc.moveDown();
        });

        // **Información del Pago**
        if (registration.payments) {
            doc.fontSize(14).text(`Información del Pago`, { underline: true }).moveDown();
            doc.text(`Monto: ${registration.payments.amount},00 ${registration.payments.currency}`);
            doc.text(`Nombre del pagador: ${registration.payments.namePayer} ${registration.payments.lastNamePayer}`);
            doc.text(`Cédula del pagador: ${formatNumberWithDots(registration.payments.identifyPayer, 'V-', '')}`);
            doc.text(`Teléfono del pagador: ${registration.payments.phonePayer}`);
            doc.text(`Fecha de pago: ${new Date(registration.payments.datePay).toLocaleDateString()}`);
        } else {
            doc.fontSize(14).text(`⚠️ No hay pagos registrados`, { underline: true, color: 'red' }).moveDown();
        }

        doc.end();
    }

    async generateStudentConstanst(studentId: number, res: Response) {
        const student = await this.prisma.registration.findFirst({
            where: { studentId },
            include: { student: { include: { grade: true } } }
        });

        const adminUser = await this.prisma.user.findFirst({
            where: { id: 1 },
            include: { rol: true }
        });

        if (!student) {
            badResponse.message = `No se encontró inscripción para el estudiante con ID ${studentId}`
            return badResponse;
        }

        // Crear PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=inscripcion_${studentId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        const imagePath = path.join(__dirname, '../assets/logoColegio.jpg',);
        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, 250, 30, { width: 100 }); // Posición (x, y) y tamaño
        } else {
            console.log(`No existe ${imagePath}`);
        }

        // Título
        doc.moveDown(10);
        // **Encabezado**
        doc.fontSize(20).text(`Constancia de Estudio`, { align: 'center' }).moveDown();

        // **Datos del Estudiante**
        doc.fontSize(14).text(`MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN`, { align: 'center' })
        doc.text(`U.E.P CARLOS FINLAY`, { align: 'center' })
        doc.text(`RIF: J-40617934-5`, { align: 'center' })
        doc.text(`COD. DEA: PD21602313. COD. ESTADISTICO: 232921`, { align: 'center' })
        doc.text(`CDCE FRANCISCO EUGENIO BUSTAMANTE`, { align: 'center' })
        doc.text(`MARACAIBO-ESTADO ZULIA`, { align: 'center' }).moveDown();


        doc.text(`Quien suscribe, ${adminUser.firstName} ${adminUser.lastName}, portador(a) de la cedula de identidad N° ${formatNumberWithDots(adminUser.identify, 'V-', '')} en mi carácter de: ${adminUser.rol.rol} Parroquia Francisco Eugenio Bustamante,  Municipio Maracaibo, hace constar que el (la) alumno (a): ${student.student.firstName} ${student.student.lastName}, Cursa  ${student.student.grade.grade} de Educación Media General  sección: Única durante el Año Escolar: 2024-2025 Constancia que se expide a petición de la parte interesada, en Maracaibo a los ${new Date(student.startDate).getDay()} días del mes de  ${monthName(new Date(student.startDate).getMonth())} del ${new Date(student.startDate).getFullYear()}`);
        doc.moveDown(2);

        doc.text(`DIRECTOR`, { align: 'center' });
        doc.text(`Profesor Luis  A. Aguirre P.`, { align: 'center' });
        doc.text(`C.I: 4.522.268.`, { align: 'center' });
        doc.text(`_____________`, { align: 'center' });
        doc.text(`Teléfono: 0412-6555031`, { align: 'center' });
        doc.moveDown(2);

        doc.end();
    }
}

export const formatNumberWithDots = (number: number | string, prefix?: string, suffix?: string): string => {
    return `${prefix}${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${suffix}`;
}

export const monthName = (month: number): string => {
    if (month == 1) return 'Enero';
    if (month == 2) return 'Febrero';
    if (month == 3) return 'Marzo';
    if (month == 4) return 'Abril';
    if (month == 5) return 'Mayo';
    if (month == 6) return 'Junio';
    if (month == 7) return 'Julio';
    if (month == 8) return 'Agosto';
    if (month == 9) return 'Septiembre';
    if (month == 10) return 'Octubre';
    if (month == 11) return 'Noviembre';
    if (month == 12) return 'Diciembre';
    return '';
}
