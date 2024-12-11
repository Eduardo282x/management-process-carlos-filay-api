import { Injectable } from '@nestjs/common';
import { DtoLogin, ResponseLogin } from 'src/dtos/auth.dto';
import { DtoBaseResponse, badResponse, baseResponse } from 'src/dtos/base.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) { }

    async login(userLogin: DtoLogin): Promise<ResponseLogin | DtoBaseResponse> {
        const { username, password } = userLogin;

        const findUser = await this.prismaService.user.findFirst({
            where: {
                username,
                password,
            },
            include: {
                rol: true,
            }
        });

        if (!findUser) {
            badResponse.message = 'El email o la contraseña son incorrectos';
            return badResponse;
        }

        if (!findUser.status) {
            badResponse.message = 'El usuario no se encuentra activo';
            return badResponse;
        }

        baseResponse.message = `Bienvenido ${findUser.firstName} ${findUser.lastName}`;
        const loginResponse: ResponseLogin = {
            ...baseResponse,
            userData: findUser
        }

        return loginResponse;
    }
}
