import { Injectable } from '@nestjs/common';
import { MethodPayment, Payments } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { DtoMethodPayments, DtoUpdateMethodPayments } from 'src/dtos/payment.dto';
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
            baseResponse.message = 'Método de pago agregado exitosamente.'
            return baseResponse;
        }

        catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }
}
