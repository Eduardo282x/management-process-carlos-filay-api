import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRegistrationDto } from 'src/dtos/registration.dto';
import { RegistrationService } from './registration.service';
import { Grades, Registration } from '@prisma/client';

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

}
