import { Injectable } from '@nestjs/common';
import { Grades } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { DtoGrade, DtoUpdateGrade } from 'src/dtos/grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GradesService {

    constructor(private prismaService: PrismaService) {

    }

    async getGrades(): Promise<Grades[]> {
        return await this.prismaService.grades.findMany({
            orderBy: {id: 'asc'}
        });
    }

    async createGrade(grade: DtoGrade): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.grades.create({
                data: {
                    grade: grade.grade
                }
            })
            baseResponse.message = 'Grado agregado.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }

    async updateGrade(grade: DtoUpdateGrade): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.grades.update({
                data: {
                    grade: grade.grade
                },
                where: {
                    id: grade.id
                }
            })
            baseResponse.message = 'Grado actualizado.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }
}
