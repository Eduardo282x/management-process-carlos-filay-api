import { Injectable } from '@nestjs/common';
import { Subjects } from '@prisma/client';
import { DtoBaseResponse, baseResponse, badResponse } from 'src/dtos/base.dto';
import { DtoSubjects, DtoUpdateSubjects } from 'src/dtos/grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubjectsService {


    constructor(private prismaService: PrismaService) {

    }

    async getSubjects(): Promise<Subjects[]> {
        return await this.prismaService.subjects.findMany({
            include: {Grades: true},
            orderBy: {id: 'asc'}
        });
    }

    async createSubjects(subjects: DtoSubjects): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.subjects.create({
                data: {
                    gradeId: subjects.gradeId,
                    subject: subjects.subject
                }
            })
            baseResponse.message = 'Materia agregada.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }

    async updateSubject(subjects: DtoUpdateSubjects): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.subjects.update({
                data: {
                    gradeId: subjects.gradeId,
                    subject: subjects.subject
                },
                where: {
                    id: subjects.id
                }
            })
            baseResponse.message = 'Materia actualizada.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }

}
