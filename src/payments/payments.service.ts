import { Injectable } from '@nestjs/common';
import { MethodPayment, Payments } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { DtoMethodPayments, DtoMonthlyFee, DtoMonthlyPay, DtoUpdateMethodPayments, DtoUpdateMonthlyFee } from 'src/dtos/payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankData, IBank } from './payment.data';

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
                methodPayment: true
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
            badResponse.message += err.message;
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
            badResponse.message += err.message;
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
            badResponse.message += err.message;
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
            badResponse.message += err;
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
            badResponse.message += err;
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
            },
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
            badResponse.message += 'No se encontró la mensualidad para este estudiante.'
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

}
