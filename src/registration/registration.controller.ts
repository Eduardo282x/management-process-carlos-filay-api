import { Body, Controller, Get, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { CreateRegistrationDto } from 'src/dtos/registration.dto';
import { RegistrationService } from './registration.service';
import { Grades, Registration } from '@prisma/client';
import { Response } from 'express';

@Controller('registration')
export class RegistrationController {

    constructor(private readonly registrationService: RegistrationService) { }

    @Get('/inscriptions')
    async getInscriptions(): Promise<Registration[]> {
        return await this.registrationService.getInscriptions();
    }

    @Post()
    async create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return await this.registrationService.createRegistration(createRegistrationDto);
    }

    @Get('/grades')
    async getGrades(): Promise<Grades[]> {
        return await this.registrationService.getGrades();
    }

    @Get('/report/:id')
    async getStudentRegistrationReport(
        @Param('id', ParseIntPipe) studentId: number,
        @Res() res: Response
    ) {
        return this.registrationService.generateStudentRegistrationReport(studentId, res);
    }

    @Get('/constancia/:id')
    async generateStudentConstanst(
        @Param('id', ParseIntPipe) studentId: number,
        @Res() res: Response
    ) {
        return this.registrationService.generateStudentConstanst(studentId, res);
    }

}
