import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Students } from '@prisma/client';

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
}
