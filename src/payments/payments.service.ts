import { Injectable } from '@nestjs/common';
import { MethodPayment, Payments } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { DtoMethodPayments, DtoMonthlyFee, DtoMonthlyPay, DtoPendingAmount, DtoUpdateMethodPayments, DtoUpdateMonthlyFee } from 'src/dtos/payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankData, IBank } from './payment.data';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { formatNumberWithDots } from 'src/registration/registration.service';

@Injectable()
export class PaymentsService {

    constructor(private prismaService: PrismaService) {

    }

    async getMethodPayments(): Promise<MethodPayment[]> {
        return await this.prismaService.methodPayment.findMany();
    }

    getBanks(): IBank[] {
        return BankData;
    }

    async getPayments(): Promise<Payments[]> {
        return await this.prismaService.payments.findMany({
            include: {
                methodPayment: true,
                student: true
            }
        });
    }

    async createMethodPayments(newMethod: DtoMethodPayments): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.methodPayment.create({
                data: {
                    type: newMethod.type,
                    bank: newMethod.bank,
                    countNumber: newMethod.countNumber,
                    identify: newMethod.identify,
                    email: newMethod.email,
                    phone: newMethod.phone,
                    owner: newMethod.owner,
                }
            })
            baseResponse.message = 'Método de pago agregado exitosamente.'
            return baseResponse;
        }

        catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updateMethodPayments(method: DtoUpdateMethodPayments): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.methodPayment.update({
                data: {
                    type: method.type,
                    bank: method.bank,
                    countNumber: method.countNumber,
                    identify: method.identify,
                    email: method.email,
                    phone: method.phone,
                    owner: method.owner,
                },
                where: {
                    id: method.id
                }
            })
            baseResponse.message = 'Método de pago actualizado exitosamente.'
            return baseResponse;
        }

        catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async deleteMethodPayment(id: number): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.methodPayment.delete({
                where: {
                    id: id
                }
            });
            baseResponse.message = 'Método de pago eliminado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    // ------------------------------------------------------------

    async getMonthlyFee() {
        return await this.prismaService.monthlyFee.findMany();
    }

    async createMonthlyFee(monthly: DtoMonthlyFee) {
        try {
            await this.prismaService.monthlyFee.create({
                data: {
                    month: monthly.month,
                    year: monthly.year,
                    amount: monthly.amount,
                }
            });
            baseResponse.message = 'Mensualidad agregada.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err;
            return badResponse;
        }
    }

    async updateMonthlyFee(monthly: DtoUpdateMonthlyFee) {
        try {
            await this.prismaService.monthlyFee.update({
                data: {
                    month: monthly.month,
                    year: monthly.year,
                    amount: monthly.amount,
                },
                where: {
                    id: monthly.id
                }
            });
            baseResponse.message = 'Mensualidad actualizada.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err;
            return badResponse;
        }
    }

    // Obtener estudiantes que aún no han pagado completamente su mensualidad
    async getStudentsPaymentStatus() {
        const currentMonth = new Date().getMonth() + 1; // Mes actual (1-12)
        const currentYear = new Date().getFullYear();   // Año actual

        return this.prismaService.students.findMany({
            orderBy: {
                id: 'asc'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                identify: true,
                MonthlyPayment: {
                    where: {
                        monthlyFee: { month: currentMonth, year: currentYear }
                    },
                    select: {
                        status: true,
                    },
                },
            },
        }).then(students =>
            students.map(student => ({
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                identify: student.identify,
                hasPaid: student.MonthlyPayment.length > 0
                    ? student.MonthlyPayment.every(mp => mp.status)
                    : false, // Si no tiene registro, consideramos que no ha pagado
            }))
        );
    }

    async getAllStudentPayments() {
        const payments = await this.prismaService.paymentDetail.findMany({
            include: {
                monthlyPayment: {
                    include: {
                        monthlyFee: true, // Información del mes
                        student: true // Información del estudiante
                    }
                }
            }
        });

        return payments.map((payment) => ({
            studentId: payment.monthlyPayment.student.id,
            studentName: `${payment.monthlyPayment.student.firstName} ${payment.monthlyPayment.student.lastName}`,
            studentIdentify: `${payment.monthlyPayment.student.identify}`,
            namePayer: `${payment.namePayer} ${payment.lastNamePayer}`,
            identifyPayer: payment.identifyPayer,
            month: payment.monthlyPayment.monthlyFee.month, // Mes de la mensualidad
            amountPaid: payment.amountPaid,
            datePay: payment.datePay
        }));
    }

    // Obtener cuánto deben pagar los estudiantes para estar al día
    async getStudentsPendingAmounts() {
        const currentMonth = new Date().getMonth() + 1; // Mes actual
        const currentYear = new Date().getFullYear();   // Año actual

        return this.prismaService.students.findMany({
            orderBy: {
                id: 'asc'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                identify: true,
                grade: true,
                MonthlyPayment: {
                    where: {
                        monthlyFee: { month: currentMonth, year: currentYear }
                    },
                    select: {
                        monthlyFee: {
                            select: { amount: true }
                        },
                        payments: {
                            select: { amountPaid: true }
                        },
                    },
                },
            }
        }).then(students =>
            students.map(student => {
                const totalAmount = student.MonthlyPayment.length > 0
                    ? student.MonthlyPayment[0].monthlyFee.amount
                    : 0;

                const totalPaid = student.MonthlyPayment.flatMap(mp => mp.payments).reduce((sum, p) => sum + p.amountPaid, 0);
                const remaining = totalAmount - totalPaid;

                return {
                    id: student.id,
                    name: `${student.firstName} ${student.lastName}`,
                    identify: student.identify,
                    grade: student.grade.grade,
                    totalAmount,
                    totalPaid,
                    remaining,
                    completePay: remaining === 0
                };
            })
        );
    }

    //Agregar pago de mensualidad
    async createMonthlyPayment(dto: DtoMonthlyPay) {
        const monthlyPayment = await this.prismaService.monthlyPayment.findFirst({
            where: {
                studentId: dto.studentId,
                monthlyFeeId: dto.monthlyFeeId,
            },
            include: {
                monthlyFee: true,
                payments: true,
            },
        });

        if (!monthlyPayment) {
            badResponse.message = 'No se encontró la mensualidad para este estudiante.'
            return badResponse;
        }

        // Calcular el total pagado hasta ahora
        const totalPaid = monthlyPayment.payments.reduce((sum, payment) => sum + payment.amountPaid, 0) + dto.amountPaid;

        // Registrar el pago
        const newPayment = await this.prismaService.paymentDetail.create({
            data: {
                monthlyPaymentId: monthlyPayment.id,
                paymentMethodId: dto.paymentMethodId,
                amountPaid: dto.amountPaid,
                datePay: new Date(),
                namePayer: dto.namePayer,
                lastNamePayer: dto.lastNamePayer,
                identifyPayer: dto.identifyPayer,
                phonePayer: dto.phonePayer,
            },
        });

        // Verificar si ya está completamente pagado
        if (totalPaid >= monthlyPayment.monthlyFee.amount) {
            await this.prismaService.monthlyPayment.update({
                where: { id: monthlyPayment.id },
                data: { status: true },
            });
        }

        baseResponse.message = 'Pago registrado';
        return baseResponse;
    }


    // ---------------------------------------------
    async generateStudentPaymentReport(studentId: number, res: Response) {
        const student = await this.prismaService.payments.findFirst({
            include: {
                methodPayment: true,
                student: true
            },
            where: { studentId }
        });

        if (!student) {
            badResponse.message = 'Estudiante no encontrado'
            return badResponse;
        }

        // Crear PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=notas_${studentId}.pdf`);
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
        doc.fontSize(20).text(`Constancia de pago`, { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Estudiante: ${student.student.firstName} ${student.student.lastName}`);
        doc.text(`Cédula: ${student.student.identify}`);
        doc.text(`Edad: ${student.student.age}`);
        doc.moveDown(2);

        doc.fontSize(12).text(`Pagador: ${student.namePayer} ${student.lastNamePayer}`);
        doc.text(`Cédula: ${student.identifyPayer}`);
        doc.text(`Teléfono: ${student.phonePayer}`);
        doc.text(`Cantidad: ${student.amount}`);
        doc.moveDown(2);
        doc.fontSize(12).text(`A la cuenta de:`);
        doc.text(`Banco: ${student.methodPayment.bank}`);
        doc.text(`Teléfono: ${student.methodPayment.phone}`);
        doc.text(`Cédula: ${student.methodPayment.identify}`);
        doc.text(`Correo: ${student.methodPayment.email}`);
        doc.text(`Tipo: ${student.methodPayment.type}`);
        doc.moveDown(2);

        doc.end();
    }

    async generateStudentMonthlyReport(studentId: number, res: Response) {
        const payments = await this.prismaService.paymentDetail.findFirst({
            include: {
                monthlyPayment: {
                    include: {
                        monthlyFee: true, // Información del mes
                        student: true // Información del estudiante
                    }
                },
                methodPayment: true
            },
            where: { monthlyPayment: { studentId } }
        });

        if (!payments) {
            badResponse.message = 'Estudiante no encontrado'
            return badResponse;
        }

        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=notas_${studentId}.pdf`);
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
        doc.fontSize(20).text(`Constancia de pago`, { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Estudiante: ${payments.monthlyPayment.student.firstName} ${payments.monthlyPayment.student.lastName}`);
        doc.text(`Cédula: ${formatNumberWithDots(payments.monthlyPayment.student.identify, 'V-', '')}`);
        doc.text(`Edad: ${payments.monthlyPayment.student.age}`);
        doc.moveDown(2);

        doc.fontSize(12).text(`Pagador: ${payments.namePayer} ${payments.lastNamePayer}`);
        doc.text(`Cédula: ${formatNumberWithDots(payments.identifyPayer, 'V-', '')}`);
        doc.text(`Teléfono: ${payments.phonePayer}`);
        doc.text(`Cantidad: ${payments.amountPaid}`);
        doc.moveDown(2);
        doc.fontSize(12).text(`A la cuenta de:`);
        doc.text(`Banco: ${payments.methodPayment.bank}`);
        doc.text(`Teléfono: ${payments.methodPayment.phone}`);
        doc.text(`Cédula: ${formatNumberWithDots(payments.methodPayment.identify, 'V-', '')}`);
        doc.text(`Correo: ${payments.methodPayment.email}`);
        doc.text(`Tipo: ${payments.methodPayment.type}`);
        doc.moveDown(2);

        doc.end();
    }

    async generatePendingAmount(bodyPending: DtoPendingAmount, res: Response) {
        const currentMonth = new Date().getMonth() + 1; // Mes actual
        const currentYear = new Date().getFullYear();   // Año actual

        const studentPending = await this.prismaService.students.findMany({
            orderBy: {
                id: 'asc'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                identify: true,
                grade: true,
                MonthlyPayment: {
                    where: {
                        monthlyFee: { month: currentMonth, year: currentYear }
                    },
                    select: {
                        monthlyFee: {
                            select: { amount: true }
                        },
                        payments: {
                            select: { amountPaid: true }
                        },
                    },
                },
            }
        }).then(students =>
            students.map(student => {
                const totalAmount = student.MonthlyPayment.length > 0
                    ? student.MonthlyPayment[0].monthlyFee.amount
                    : 0;

                const totalPaid = student.MonthlyPayment.flatMap(mp => mp.payments).reduce((sum, p) => sum + p.amountPaid, 0);
                const remaining = totalAmount - totalPaid;

                return {
                    id: student.id,
                    name: `${student.firstName} ${student.lastName}`,
                    identify: student.identify,
                    gradeId: student.grade.id,
                    grade: student.grade.grade,
                    totalAmount,
                    totalPaid,
                    remaining,
                    completePay: remaining === 0
                };
            })
        );

        if (studentPending.length === 0) {
            badResponse.message = 'Algo fallo'
            return badResponse;
        }

        let getDatatFilter: PedingAmount[] = studentPending;

        if (bodyPending.status === 'deben') {
            getDatatFilter = studentPending.filter(student => student.completePay === true);
        }
        if (bodyPending.status === 'solventes') {
            getDatatFilter = studentPending.filter(student => student.completePay === false);
        }
        if (bodyPending.grade !== '') {
            getDatatFilter = studentPending.filter(student => student.grade === bodyPending.grade);
        }

        // Crear PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=contanscia.pdf`);
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
        doc.fontSize(20).text(`Estados de pagos`, { align: 'center' }).moveDown();
        doc.moveDown(2);

        // **Tabla de Notas**
        const startX = 50;
        let startY = doc.y;

        // Dibujar encabezado de la tabla
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Estudiante', startX, startY);
        doc.text('Cédula', startX + 150, startY);
        doc.text('Grado', startX + 250, startY);
        doc.text('Debe', startX + 400, startY);
        startY += 20;
        doc.moveTo(startX, startY).lineTo(550, startY).stroke();
        startY += 10;

        // Dibujar las filas de notas
        doc.font('Helvetica');
        getDatatFilter.map(pending => {
            doc.text(pending.name, startX, startY);
            doc.text(formatNumberWithDots(pending.identify, 'V-',''), startX + 150, startY);
            doc.text(pending.grade, startX + 250, startY);
            doc.text(`${pending.remaining},00 `, startX + 400, startY);
            startY += 20;
        });

        doc.end();
    }
}


interface PedingAmount {
    id: number;
    name: string;
    identify: string;
    grade: string;
    gradeId: number;
    totalAmount: number;
    totalPaid: number;
    remaining: number;
    completePay: boolean;
}