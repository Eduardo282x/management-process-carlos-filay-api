import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DtoMethodPayments } from 'src/dtos/payment.dto';

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

}
