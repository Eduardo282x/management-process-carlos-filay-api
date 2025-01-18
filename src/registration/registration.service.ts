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

            // Create parents
            const parentPromises = parents.map((parent) =>
                tx.parents.create({
                    data: {
                        firstName: parent.firstName,
                        lastName: parent.lastName,
                        identify: parent.identify,
                        age: parent.age,
                        phone: parent.phone,
                        address: parent.address,
                        status: true,
                    },
                }),
            );

            const createdParents = await Promise.all(parentPromises);

            // Link parents to student
            for (const parent of createdParents) {
                await tx.studentParent.create({
                    data: {
                        studentId: createdStudent.id,
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
            const createdRegistration = await tx.registration.create({
                data: {
                    studentId: createdStudent.id,
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
