import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { DtoSubjects, DtoUpdateSubjects } from 'src/dtos/grade.dto';

@Controller('subjects')
export class SubjectsController {

    constructor(private subjectService: SubjectsService) {

    }

    @Get()
    async getSubjects() {
        return await this.subjectService.getSubjects();
    }
    @Post()
    async createSubjects(@Body() subjects: DtoSubjects) {
        return await this.subjectService.createSubjects(subjects);
    }
    @Put()
    async updateSubject(@Body() subjects: DtoUpdateSubjects) {
        return await this.subjectService.updateSubject(subjects);
    }
}
