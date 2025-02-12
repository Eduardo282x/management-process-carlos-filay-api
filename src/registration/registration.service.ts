import { Injectable } from '@nestjs/common';
import { Grades, Registration } from '@prisma/client';
import { badResponse, baseResponse } from 'src/dtos/base.dto';
import { CreateRegistrationDto } from 'src/dtos/registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';

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
                student: true,
                Grades: true,
            },
        });

        if (!registration) {
            badResponse.message = 'No se encontró inscripción para el estudiante con ID';
            return badResponse;
        }

        // Crear PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=inscripcion_${studentId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        // **Encabezado**
        doc.fontSize(20).text(`Reporte de Inscripción`, { align: 'center' }).moveDown();

        // **Datos del Estudiante**
        doc.fontSize(14).text(`Nombre: ${registration.student.firstName} ${registration.student.lastName}`);
        doc.text(`Cédula: V-${registration.student.identify}`);
        doc.text(`Grado: ${registration.Grades.grade}`);
        doc.text(`Período: ${registration.period}`);
        doc.text(`Fecha de inscripción: ${new Date(registration.startDate).toLocaleDateString()}`);
        doc.moveDown(2);

        doc.end();
    }
}
