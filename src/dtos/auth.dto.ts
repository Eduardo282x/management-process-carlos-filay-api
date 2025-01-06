import { IsString } from "class-validator";
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