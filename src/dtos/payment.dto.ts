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


export class DtoMonthlyFee {
    @IsNumber()
    month: number;
    @IsNumber()
    year: number;
    @IsNumber()
    amount: number;
}

export class DtoUpdateMonthlyFee extends DtoMonthlyFee {
    @IsNumber()
    id: number;
}



//DTO Pago mensualidad
import { IsDateString } from 'class-validator';

export class DtoMonthlyPay {
    @IsInt()
    studentId: number;

    @IsInt()
    monthlyFeeId: number;

    @IsInt()
    paymentMethodId: number;

    @IsInt()
    amountPaid: number;

    @IsString()
    @IsNotEmpty()
    namePayer: string;

    @IsString()
    @IsNotEmpty()
    lastNamePayer: string;

    @IsString()
    @IsNotEmpty()
    identifyPayer: string;

    @IsString()
    @IsNotEmpty()
    phonePayer: string;
}
