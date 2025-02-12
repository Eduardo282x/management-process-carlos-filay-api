import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { NotesService } from './notes.service';
import { DtoNotes, DtoUpdateNotes } from 'src/dtos/grade.dto';
import { Response } from 'express';

@Controller('notes')
export class NotesController {

    constructor(private notesService: NotesService) {

    }

    @Get()
    async getNotes() {
        return await this.notesService.getNotes();
    }
    @Get('/:id')
    async getNotesByStudent(@Param('id') id: string) {
        return await this.notesService.getNotesByStudent(Number(id));
    }

    @Get('/students/report/:id')
    async getStudentReport(
        @Param('id', ParseIntPipe) studentId: number,
        @Res() res: Response
    ) {
        return this.notesService.generateStudentReport(studentId, res);
    }

    @Post()
    async createNotes(@Body() notes: DtoNotes) {
        return await this.notesService.createNotes(notes);
    }
    @Put()
    async updateNotes(@Body() notes: DtoUpdateNotes) {
        return await this.notesService.updateNotes(notes);
    }
}
