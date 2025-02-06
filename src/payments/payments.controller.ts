import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DtoMethodPayments, DtoMonthlyFee, DtoMonthlyPay, DtoUpdateMethodPayments, DtoUpdateMonthlyFee } from 'src/dtos/payment.dto';

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

    @Get('/pending')
    async getStudentsWithPendingPayments() {
        return this.paymentService.getStudentsPaymentStatus();
    }

    @Get('/pendingAmount')
    async getPendingAmounts() {
        return this.paymentService.getStudentsPendingAmounts();
    }

    @Get('/students')
    async paymentStudents() {
        return this.paymentService.getAllStudentPayments();
    }

    // Ruta para crear un nuevo pago
    @Post('/pendingAmount')
    create(@Body() createPaymentDto: DtoMonthlyPay) {
        return this.paymentService.createMonthlyPayment(createPaymentDto);
    }

    @Get('/monthly')
    async getMonthlyFee() {
        return this.paymentService.getMonthlyFee();
    }
    @Post('/monthly')
    async createMonthlyFee(@Body() monthly: DtoMonthlyFee) {
        return this.paymentService.createMonthlyFee(monthly);
    }
    @Put('/monthly')
    async updateMonthlyFee(@Body() monthly: DtoUpdateMonthlyFee) {
        return this.paymentService.updateMonthlyFee(monthly);
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
