import { IsNumber, IsString } from "class-validator";
import { DtoBaseResponse } from "./base.dto";
import { User } from "@prisma/client";

export class DtoLogin {
    @IsString()
    username: string;
    @IsString()
    password: string;
}

export class ResponseLogin extends DtoBaseResponse {
    userData: User;
}

export class DtoReturnPassword {
    @IsString()
    username: string;
    @IsString()
    identify: string;
    @IsString()
    password: string;
}

export class DtoPassword {
    @IsNumber()
    id: number;
    @IsString()
    password: string;
}