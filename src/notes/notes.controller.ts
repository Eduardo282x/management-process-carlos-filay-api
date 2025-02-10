import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { DtoNotes, DtoUpdateNotes } from 'src/dtos/grade.dto';

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
    @Post()
    async createNotes(@Body() notes: DtoNotes) {
        return await this.notesService.createNotes(notes);
    }
    @Put()
    async updateNotes(@Body() notes: DtoUpdateNotes) {
        return await this.notesService.updateNotes(notes);
    }
}
