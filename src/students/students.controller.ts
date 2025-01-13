import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Students } from '@prisma/client';
import { CreateStudentDto, DtoStudentsUpdate } from 'src/dtos/students.dto';

@Controller('students')
export class StudentsController {

    constructor(private studentsService: StudentsService) {

    }

    @Get()
    async getStudents(): Promise<Students[]> {
        return await this.studentsService.getStudents();
    }

    @Get('/parents/:id')
    async getParentsStudens(@Param('id') id: string) {
        return await this.studentsService.getParentsStudents(Number(id));
    }

    @Post()
    async createStudents(@Body() newStudents: CreateStudentDto) {
        return await this.studentsService.createStudents(newStudents);
    }

    @Put()
    async updateStudents(@Body() students: DtoStudentsUpdate) {
        return await this.studentsService.updateStudents(students);
    }

    @Delete('/:id')
    async deleteStudents(@Param('id') id: number) {
        return await this.studentsService.deleteStudents(id);
    }
}
