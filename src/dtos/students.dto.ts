import { IsBoolean, IsISBN, IsNumber, IsString } from "class-validator";

export class DtoStudents {
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsString()
    identify: string;
    @IsNumber()
    age: number;
    @IsNumber()
    gradeId: number;
    @IsString()
    address: string;
    @IsBoolean()
    status: boolean;
}

export class DtoStudentsUpdate extends DtoStudents {
    @IsNumber()
    id: number;
}

export class DtoParents {
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsNumber()
    age: number;
    @IsString()
    identify: string;
    @IsString()
    phone: string;
    @IsString()
    address: string;
    @IsBoolean()
    status: boolean;
}

export class DtoParentsUpdate extends DtoParents {
    @IsNumber()
    id: number;
}