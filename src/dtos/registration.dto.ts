import { IsNotEmpty, IsString, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDto } from './payment.dto';
import { CreateStudentDto } from './students.dto';

export class CreateRegistrationDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateStudentDto)
    student: CreateStudentDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreatePaymentDto)
    payment: CreatePaymentDto;

    @IsNotEmpty()
    @IsString()
    period: string;

    @IsNotEmpty()
    @IsInt()
    gradesId: number;

    @IsNotEmpty()
    @IsInt()
    paymentMethodId: number;
}
