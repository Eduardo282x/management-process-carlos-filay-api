import { Injectable } from '@nestjs/common';
import { MethodPayment, Payments, TypePayment } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { DtoMethodPayments, DtoUpdateMethodPayments } from 'src/dtos/payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {

    constructor(private prismaService: PrismaService) {

    }

    async getTypePayments(): Promise<TypePayment[]> {
        return await this.prismaService.typePayment.findMany();
    }

    async getMethodPayments(): Promise<MethodPayment[]> {
        return await this.prismaService.methodPayment.findMany({
            include: {
                type: true
            }
        });
    }

    async getPayments(): Promise<Payments[]> {
        return await this.prismaService.payments.findMany({
            include: {
                methodPayment: {
                    include: {
                        type: true
                    }
                }
            }
        });
    }

    async createMethodPayments(newMethod: DtoMethodPayments): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.methodPayment.create({
                data: {
                    typeId: newMethod.typeId,
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
                    typeId: method.typeId,
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
            baseResponse.message = 'Método de pago agregado exitosamente.'
            return baseResponse;
        }

        catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }
}
