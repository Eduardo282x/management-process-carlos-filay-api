import { Injectable } from '@nestjs/common';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MainloadService {

    constructor(private prismaService: PrismaService) { }

    async loadData(): Promise<DtoBaseResponse> {
        try {
            //Insertar roles
            await this.prismaService.roles.createMany({
                data: [
                    { rol: 'Administrador' },
                    { rol: 'Secretaria' }
                ]
            })

            //Insertar usuario
            await this.prismaService.user.createMany({
                data: [
                    { firstName: 'admin', lastName: 'admin', username: 'admin', password: 'admin', identify: '28391325', rolId: 1, status: true },
                    { firstName: 'Leobardo', lastName: 'Fuenmayor', username: 'leo', password: '1234', identify: '28391325', rolId: 2, status: true }
                ]
            });

            await this.prismaService.grades.createMany({
                data: [
                    { grade: "Primer grado" },
                    { grade: "Segundo grado" },
                    { grade: "Tercer grado" },
                    { grade: "Cuarto grado" },
                    { grade: "Quinto grado" },
                    { grade: "Primer año" },
                    { grade: "Segundo año" },
                    { grade: "Tercer año" },
                    { grade: "Cuarto año" },
                    { grade: "Quinto año" },
                ],
            });

            // Insertar materias
            await this.prismaService.subjects.createMany({
                data: [
                    { subject: "Matemáticas", gradeId: 1 },
                    { subject: "Ciencias", gradeId: 1 },
                    { subject: "Historia", gradeId: 1 },
                    { subject: "Geografía", gradeId: 1 },
                    { subject: "Español", gradeId: 1 },
                ],
            });

            await this.prismaService.activities.createMany({
                data: [
                    {
                        activity: 'Examen de matematica',
                        dateActivity: new Date(),
                        subjectId: 1
                    },
                    {
                        activity: 'Examen de Ciencias',
                        dateActivity: new Date(),
                        subjectId: 2
                    },
                    {
                        activity: 'Examen de Historia',
                        dateActivity: new Date(),
                        subjectId: 3
                    }
                ]
            })

            // Insertar padres
            await this.prismaService.parents.createMany({
                data: [
                    { firstName: "Juan", lastName: "Pérez", age: 40, identify: "12345678", phone: "04141234567", address: "Calle Principal 1", status: true },
                    { firstName: "María", lastName: "Gómez", age: 38, identify: "87654321", phone: "04142345678", address: "Calle Principal 2", status: true },
                    { firstName: "Carlos", lastName: "Rodríguez", age: 45, identify: "11223344", phone: "04143456789", address: "Calle Secundaria 1", status: true },
                    { firstName: "Ana", lastName: "Fernández", age: 43, identify: "99887766", phone: "04144567890", address: "Calle Secundaria 2", status: true },
                    { firstName: "Pedro", lastName: "Martínez", age: 35, identify: "55443322", phone: "04145678901", address: "Avenida Central 1", status: true },
                ],
            });

            // Insertar estudiantes
            await this.prismaService.students.createMany({
                data: [
                    { firstName: "José", lastName: "Pérez", identify: "20123456", age: 7, gradeId: 1, address: "Calle Principal 1", status: true },
                    { firstName: "Lucía", lastName: "Gómez", identify: "20123457", age: 8, gradeId: 1, address: "Calle Principal 2", status: true },
                    { firstName: "Luis", lastName: "Rodríguez", identify: "20123458", age: 9, gradeId: 2, address: "Calle Secundaria 1", status: true },
                    { firstName: "Sofía", lastName: "Fernández", identify: "20123459", age: 10, gradeId: 2, address: "Calle Secundaria 2", status: true },
                    { firstName: "Miguel", lastName: "Martínez", identify: "20123460", age: 11, gradeId: 3, address: "Avenida Central 1", status: true },
                ],
            });

            await this.prismaService.monthlyFee.createMany({
                data: [
                    { year: 2025, month: 1, amount: 200 },
                    { year: 2025, month: 2, amount: 200 },
                    { year: 2025, month: 3, amount: 200 },
                    { year: 2025, month: 4, amount: 200 },
                    { year: 2025, month: 5, amount: 200 },
                    { year: 2025, month: 6, amount: 200 },
                    { year: 2025, month: 7, amount: 200 },
                    { year: 2025, month: 8, amount: 200 },
                    { year: 2025, month: 9, amount: 200 },
                    { year: 2025, month: 10, amount: 200 },
                    { year: 2025, month: 11, amount: 200 },
                    { year: 2025, month: 12, amount: 200 }
                ]
            })

            await this.prismaService.monthlyPayment.createMany({
                data: [
                    { studentId: 1, status: false, monthlyFeeId: 2 },
                    { studentId: 2, status: false, monthlyFeeId: 2 },
                    { studentId: 3, status: false, monthlyFeeId: 2 },
                    { studentId: 4, status: false, monthlyFeeId: 2 },
                    { studentId: 5, status: false, monthlyFeeId: 2 }
                ]
            })

            // Relacionar estudiantes con padres
            await this.prismaService.studentParent.createMany({
                data: [
                    { studentId: 1, parentId: 1 },
                    { studentId: 1, parentId: 2 },
                    { studentId: 2, parentId: 3 },
                    { studentId: 3, parentId: 4 },
                    { studentId: 4, parentId: 5 },
                ],
            });

            // Insertar métodos de pago
            await this.prismaService.methodPayment.createMany({
                data: [
                    {
                        type: 'Pago Movil',
                        bank: 'Banesco',
                        identify: '28391325',
                        countNumber: '',
                        email: '',
                        phone: '04165610813',
                        owner: 'Carlos Filay'
                    },
                    {
                        type: 'Transferencia',
                        bank: 'BNC',
                        identify: '28391325',
                        countNumber: '01910032401032027645',
                        email: '',
                        phone: '',
                        owner: 'Carlos Filay'
                    },
                    {
                        type: 'Zelle',
                        bank: 'Zelle',
                        identify: '',
                        countNumber: '',
                        email: 'correo@gmail.com',
                        phone: '',
                        owner: 'Carlos Filay'
                    }
                ]
            })

            // Insertar pagos
            await this.prismaService.payments.createMany({
                data: [
                    {
                        amount: 100,
                        currency: "Bs",
                        studentId: 1,
                        datePay: new Date(),
                        namePayer: "Juan",
                        lastNamePayer: "Pérez",
                        identifyPayer: "12345678",
                        phonePayer: "04141234567",
                        paymentMethodId: 1
                    },
                    {
                        amount: 200,
                        currency: "Bs",
                        studentId: 2,
                        datePay: new Date(),
                        namePayer: "María",
                        lastNamePayer: "Gómez",
                        identifyPayer: "87654321",
                        phonePayer: "04142345678",
                        paymentMethodId: 2
                    }
                ],
            });

            await this.prismaService.registration.createMany({
                data: [
                    {
                        studentId: 1,
                        startDate: new Date(),
                        period: '2025-1',
                        gradesId: 1,
                        paymentId: 1
                    },
                    {
                        studentId: 2,
                        startDate: new Date(),
                        period: '2025-1',
                        gradesId: 1,
                        paymentId: 2
                    },
                    {
                        studentId: 3,
                        startDate: new Date(),
                        period: '2025-1',
                        gradesId: 2,
                        paymentId: 1
                    },
                    {
                        studentId: 4,
                        startDate: new Date(),
                        period: '2025-1',
                        gradesId: 2,
                        paymentId: 2
                    },
                    {
                        studentId: 5,
                        startDate: new Date(),
                        period: '2025-1',
                        gradesId: 3,
                        paymentId: 2
                    },
                ]
            });


            await this.prismaService.notes.createMany({
                data: [
                    { activityId: 1, studentId: 1, note: 15 },
                    { activityId: 2, studentId: 1, note: 15 },
                    { activityId: 3, studentId: 1, note: 15 },
                ]
            })

            baseResponse.message = 'Data cargada exitosamente.'
            return baseResponse;
        } catch (error) {
            badResponse.message = error.message
            return badResponse;
        }
    }
}
