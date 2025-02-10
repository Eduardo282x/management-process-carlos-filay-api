import { Injectable } from '@nestjs/common';
import { Notes } from '@prisma/client';
import { DtoBaseResponse, baseResponse, badResponse } from 'src/dtos/base.dto';
import { DtoNotes, DtoUpdateNotes } from 'src/dtos/grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {

    constructor(private prismaService: PrismaService) {

    }

    async getNotes(): Promise<Notes[]> {
        return await this.prismaService.notes.findMany({
            include: {
                Activities: true,
                student: true
            },
            orderBy: {id: 'asc'}
        });
    }

    async getNotesByStudent(studentId: number) {
        const student = await this.prismaService.students.findFirst({
            include: {
                Notes: {
                    include: {
                        Activities: {
                            include: {
                                subjects: true, // Para obtener la materia de la actividad
                            },
                        },
                    },
                },
            },
            where: { id: studentId }
        });

        // Agrupar notas por materia
        const subjectsMap = new Map<number, { subject: string; notes: number[] }>();

        student.Notes.forEach((note) => {
            const subjectId = note.Activities.subjects.id;
            const subjectName = note.Activities.subjects.subject;

            if (!subjectsMap.has(subjectId)) {
                subjectsMap.set(subjectId, { subject: subjectName, notes: [] });
            }

            subjectsMap.get(subjectId)?.notes.push(note.note);
        });

        // Convertir el mapa a un array con el cálculo del promedio
        const notes = Array.from(subjectsMap.entries()).map(([subjectId, data]) => ({
            subjectId,
            subject: data.subject,
            notes: data.notes,
            promedio: data.notes.reduce((acc, val) => acc + val, 0) / data.notes.length,
        }));

        return {
            studentId: student.id,
            student: {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                identify: student.identify,
                age: student.age,
                address: student.address,
            },
            notes,
        };
    }

    async createNotes(notes: DtoNotes): Promise<DtoBaseResponse> {
        try {
            const findNote = await this.prismaService.notes.findFirst({
                where: {
                    activityId: notes.activityId,
                    studentId: notes.studentId,
                }
            })

            if(findNote){
                badResponse.message = 'Ya existe una nota para esta actividad.'
                return badResponse;
            }

            await this.prismaService.notes.create({
                data: {
                    activityId: notes.activityId,
                    studentId: notes.studentId,
                    note: notes.note
                }
            })
            baseResponse.message = 'Nota cargada.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }

    async updateNotes(notes: DtoUpdateNotes): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.notes.update({
                data: {
                    activityId: notes.activityId,
                    studentId: notes.studentId,
                    note: notes.note
                },
                where: {
                    id: notes.id
                }
            })
            baseResponse.message = 'Nota actualizada.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }
}
