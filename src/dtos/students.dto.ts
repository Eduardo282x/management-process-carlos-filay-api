import { IsNotEmpty, IsString, IsInt, ValidateNested, IsArray, IsNumber } from 'class-validator';
export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    identify: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsNotEmpty()
    @IsInt()
    gradeId: number;

    @IsNotEmpty()
    @IsString()
    address: string;
}


export class DtoStudentsUpdate extends CreateStudentDto {
    @IsNumber()
    id: number;
}