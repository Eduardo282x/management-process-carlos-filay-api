import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DtoMethodPayments, DtoMonthlyFee, DtoMonthlyPay, DtoPendingAmount, DtoUpdateMethodPayments, DtoUpdateMonthlyFee } from 'src/dtos/payment.dto';
import { Response } from 'express';

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

    // ---------------

    @Post('/download/pendingAmount')
    async generatePendingAmount(
        @Body() bodyPenging: DtoPendingAmount,
        @Res() res: Response
    ) {
        return await this.paymentService.generatePendingAmount(bodyPenging, res);
    }

    @Get('/download/payment/student/:id')
    async generateStudentPaymentReport(
        @Param('id', ParseIntPipe) studentId: number,
        @Res() res: Response
    ) {
        return this.paymentService.generateStudentPaymentReport(studentId, res);
    }

    @Get('/download/monthly/student/:id')
    async generateStudentMonthlyReport(
        @Param('id', ParseIntPipe) studentId: number,
        @Res() res: Response
    ) {
        return this.paymentService.generateStudentMonthlyReport(studentId, res);
    }
}
