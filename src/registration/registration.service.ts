import { Injectable } from '@nestjs/common';
import { Grades, Registration } from '@prisma/client';
import { baseResponse } from 'src/dtos/base.dto';
import { CreateRegistrationDto } from 'src/dtos/registration.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegistrationService {

    constructor(private prisma: PrismaService) { }

    async createRegistration(createRegistrationDto: CreateRegistrationDto) {
        const { student, payment, parents } = createRegistrationDto;

        // Begin a transaction
        return await this.prisma.$transaction(async (tx) => {
            const findStudent = await tx.students.findFirst({
                where: { identify: student.identify }
            })

            let studentId: number = 0;

            if (findStudent) {
                await tx.students.update({
                    data: {
                        age: Number(student.age),
                        gradeId: student.gradeId,
                        address: student.address,
                    },
                    where: {
                        id: findStudent.id
                    }
                });

                studentId = findStudent.id;
            } else {
                // Create student
                const createdStudent = await tx.students.create({
                    data: {
                        firstName: student.firstName,
                        lastName: student.lastName,
                        identify: student.identify,
                        age: Number(student.age),
                        gradeId: student.gradeId,
                        address: student.address,
                        status: true,
                    },
                });

                studentId = createdStudent.id
            }


            // Create parents
            const parentPromises = parents.map(async (parent) => {
                const findParent = await tx.parents.findFirst({
                    where: { identify: parent.identify }
                })

                if (findParent) {
                    return tx.parents.update({
                        data: {
                            age: parent.age,
                            phone: parent.phone,
                            address: parent.address,
                        },
                        where: {
                            id: findParent.id
                        }
                    })
                } else {
                    return tx.parents.create({
                        data: {
                            firstName: parent.firstName,
                            lastName: parent.lastName,
                            identify: parent.identify,
                            age: parent.age,
                            phone: parent.phone,
                            address: parent.address,
                            status: true,
                        },
                    })
                }
            });

            const createdParents = await Promise.all(parentPromises);

            // Link parents to student
            for (const parent of createdParents) {
                await tx.studentParent.create({
                    data: {
                        studentId: studentId,
                        parentId: parent.id,
                    },
                });
            }

            // Create payment
            const createdPayment = await tx.payments.create({
                data: {
                    amount: payment.amount,
                    currency: payment.currency,
                    datePay: new Date(),
                    namePayer: payment.ownerName,
                    lastNamePayer: payment.ownerLastname,
                    identifyPayer: payment.identify,
                    phonePayer: payment.phone,
                    paymentMethodId: payment.paymentMethodId,
                },
            });

            // Create registration
            await tx.registration.create({
                data: {
                    studentId: studentId,
                    startDate: new Date(),
                    period: payment.period,
                    gradesId: student.gradeId,
                    paymentId: createdPayment.id,
                },
            });

            baseResponse.message = 'Estudiante inscrito exitosamente.'
            return baseResponse
        });
    }

    async getGrades(): Promise<Grades[]> {
        return await this.prisma.grades.findMany();
    }

    async getInscriptions(): Promise<Registration[]> {
        return await this.prisma.registration.findMany({
            include: {
                student: true,
                Grades: true,
                payments: true
            }
        });
    }

}
