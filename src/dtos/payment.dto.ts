import { IsNumber, IsString } from "class-validator";

export class DtoMethodPayments {
    @IsNumber()
    typeId: number;
    @IsString()
    bank: string;
    @IsString()
    countNumber: string;
    @IsString()
    identify: string;
    @IsString()
    email: string;
    @IsString()
    phone: string;
    @IsString()
    owner: string;
}

export class DtoUpdateMethodPayments extends DtoMethodPayments {
    @IsNumber()
    id: number;
}