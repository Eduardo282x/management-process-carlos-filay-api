import { IsNotEmpty, IsString, IsInt, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateParentDto } from './parents.dto';

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
    @IsInt()
    age: number;

    @IsNotEmpty()
    @IsInt()
    gradeId: number;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateParentDto)
    parents: CreateParentDto[];
}


export class DtoStudentsUpdate extends CreateStudentDto {
    @IsNumber()
    id: number;
}