import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {

    constructor(private paymentService: PaymentsService) {

    }

    @Get()
    async getPayments() {
        return await this.paymentService.getPayments();
    }

    @Get('/types')
    async getTypePayments() {
        return await this.paymentService.getTypePayments();
    }

    @Get('/methods')
    async getMethodPayments() {
        return await this.paymentService.getMethodPayments();
    }

}
