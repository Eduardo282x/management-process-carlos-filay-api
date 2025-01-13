import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DtoMethodPayments, DtoUpdateMethodPayments } from 'src/dtos/payment.dto';

@Controller('payments')
export class PaymentsController {

    constructor(private paymentService: PaymentsService) {

    }

    @Get()
    async getPayments() {
        return await this.paymentService.getPayments();
    }

    @Get('/methods')
    async getMethodPayments() {
        return await this.paymentService.getMethodPayments();
    }

    @Get('/bank')
    async getBank() {
        return this.paymentService.getBanks();
    }

    @Post('/methods')
    async createMethodPayments(@Body() newMethod: DtoMethodPayments) {
        return await this.paymentService.createMethodPayments(newMethod);
    }

    @Put('/methods')
    async updateMethodPayments(@Body() method: DtoUpdateMethodPayments) {
        return await this.paymentService.updateMethodPayments(method);
    }

    @Delete('/methods/:id')
    async deleteMethodPaymentd(@Param('id') id: string) {
        return await this.paymentService.deleteMethodPayment(Number(id));
    }
}
