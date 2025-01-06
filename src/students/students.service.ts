import { Injectable } from '@nestjs/common';
import { Students } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentsService {

    constructor(private prismaService: PrismaService) {

    }

    async getStudents(): Promise<Students[]> {
        return await this.prismaService.students.findMany();
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
}
