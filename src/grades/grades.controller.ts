import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { GradesService } from './grades.service';
import { DtoGrade, DtoUpdateGrade } from 'src/dtos/grade.dto';

@Controller('grades')
export class GradesController {

    constructor(private gradesServices: GradesService) {

    }

    @Get()
    async getGrades() {
        return await this.gradesServices.getGrades();
    }
    @Post()
    async createGrade(@Body() grade: DtoGrade) {
        return await this.gradesServices.createGrade(grade);
    }
    @Put()
    async updateGrade(@Body() grade: DtoUpdateGrade) {
        return await this.gradesServices.updateGrade(grade);
    }
}
