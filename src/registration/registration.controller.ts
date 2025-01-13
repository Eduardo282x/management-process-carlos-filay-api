import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRegistrationDto } from 'src/dtos/registration.dto';
import { RegistrationService } from './registration.service';
import { Grades } from '@prisma/client';

@Controller('registration')
export class RegistrationController {

    constructor(private readonly registrationService: RegistrationService) { }

    @Post()
    async create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return await this.registrationService.createRegistration(createRegistrationDto);
    }

    @Get('/grades')
    async getGrades() :Promise<Grades[]> {
        return await this.registrationService.getGrades();
    }

}
