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
    @IsInt()
    paymentMethodId: number;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsString()
    identify: string;

    @IsNotEmpty()
    @IsString()
    period: string;

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
