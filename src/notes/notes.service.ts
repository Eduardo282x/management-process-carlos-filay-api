import { Injectable } from '@nestjs/common';
import { Notes } from '@prisma/client';
import { DtoBaseResponse, baseResponse, badResponse } from 'src/dtos/base.dto';
import { DtoNotes, DtoUpdateNotes } from 'src/dtos/grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

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
            orderBy: { id: 'asc' }
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

    async generateStudentReport(studentId: number, res: Response) {
        const student = await this.prismaService.students.findUnique({
            where: { id: studentId },
            include: {
                Notes: {
                    include: {
                        Activities: {
                            include: {
                                subjects: true, // Obtener la materia
                            },
                        },
                    },
                },
            },
        });

        if (!student) {
            badResponse.message = 'Estudiante no encontrado'
            return badResponse;
        }

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

        const notes = Array.from(subjectsMap.entries()).map(([subjectId, data]) => ({
            subject: data.subject,
            notes: data.notes,
            promedio: data.notes.reduce((acc, val) => acc + val, 0) / data.notes.length,
        }));

        // Crear PDF
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Disposition', `attachment; filename=notas_${studentId}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        const imagePath = path.join(__dirname, '../assets/logoColegio.jpg',);
        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, 250, 30, { width: 100 }); // Posición (x, y) y tamaño
        } else {
            console.log(`No existe ${imagePath}`);
        }

        // Título
        doc.moveDown(10);

        // **Encabezado**
        doc.fontSize(20).text(`Reporte de Notas`, { align: 'center' }).moveDown();
        doc.fontSize(14).text(`Estudiante: ${student.firstName} ${student.lastName}`);
        doc.text(`Cédula: ${student.identify}`);
        doc.text(`Edad: ${student.age}`);
        doc.moveDown(2);

        // **Tabla de Notas**
        const startX = 50;
        let startY = doc.y;

        // Dibujar encabezado de la tabla
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Materia', startX, startY);
        doc.text('Notas', startX + 150, startY);
        doc.text('Promedio', startX + 400, startY);
        startY += 20;
        doc.moveTo(startX, startY).lineTo(550, startY).stroke();
        startY += 10;

        // Dibujar las filas de notas
        doc.font('Helvetica');
        notes.forEach(({ subject, notes, promedio }) => {
            doc.text(subject, startX, startY);
            doc.text(notes.join(', '), startX + 150, startY);
            doc.text(promedio.toFixed(2), startX + 400, startY);
            startY += 20;
        });

        doc.end();
    }

    async createNotes(notes: DtoNotes): Promise<DtoBaseResponse> {
        try {
            const findNote = await this.prismaService.notes.findFirst({
                where: {
                    activityId: notes.activityId,
                    studentId: notes.studentId,
                }
            })

            if (findNote) {
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
