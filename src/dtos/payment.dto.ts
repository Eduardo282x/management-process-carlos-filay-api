import { IsNotEmpty, IsString, IsInt, IsEmail, IsNumber } from 'class-validator';

export class DtoMethodPayments {
    @IsString()
    type: string;
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


export class CreatePaymentDto {
    @IsNotEmpty()
    @IsInt()
    amount: number;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    bank: string;

    @IsNotEmpty()
    @IsString()
    countNumber: string;

    @IsNotEmpty()
    @IsString()
    identify: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    ownerName: string;

    @IsNotEmpty()
    @IsString()
    ownerLastname: string;
}
