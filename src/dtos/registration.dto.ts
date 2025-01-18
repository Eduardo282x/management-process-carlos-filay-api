import { IsNotEmpty, IsString, ValidateNested, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDto } from './payment.dto';
import { CreateStudentDto } from './students.dto';
import { CreateParentDto } from './parents.dto';

export class CreateRegistrationDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateStudentDto)
    student: CreateStudentDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateParentDto)
    parents: CreateParentDto[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreatePaymentDto)
    payment: CreatePaymentDto;
}
