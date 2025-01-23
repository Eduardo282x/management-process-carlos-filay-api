import { Injectable } from '@nestjs/common';
import { Students } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { CreateStudentDto, DtoStudentsUpdate, SimpleUpdateStudentDto } from 'src/dtos/students.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {

    constructor(private prismaService: PrismaService) {

    }

    async getStudents(): Promise<Students[]> {
        return await this.prismaService.students.findMany();
    }

    async findStudentAndParents(id: number): Promise<any> {
        return await this.prismaService.studentParent.findMany({
            where: {
                studentId: id
            },
            include: {
                student: true,
                parent: true
            }
        })
    }

    async getParentsStudents(studentId: number) {
        return await this.prismaService.studentParent.findMany({
            where: {
                studentId: studentId
            },
            include: {
                parent: true
            }
        })
    }

    async createStudents(newStudents: CreateStudentDto): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.students.create({
                data: {
                    firstName: newStudents.firstName,
                    lastName: newStudents.lastName,
                    identify: newStudents.identify,
                    age: Number(newStudents.age),
                    gradeId: newStudents.gradeId,
                    address: newStudents.address,
                    status: true,
                },
            });
            baseResponse.message = 'Estudiante creado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }

    async updateStudents(student: SimpleUpdateStudentDto): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.students.update({
                data: {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    identify: student.identify,
                    age: Number(student.age),
                    // gradeId: student.gradeId,
                    address: student.address,
                    status: true,
                },
                where: {
                    id: student.id
                }
            });
            baseResponse.message = 'Estudiante actualizado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }

    async deleteStudents(id: number): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.students.delete({
                where: {
                    id: id
                }
            });
            baseResponse.message = 'Estudiante eliminado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }
}
