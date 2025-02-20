import { Injectable } from '@nestjs/common';
import { DtoLogin, DtoPassword, DtoReturnPassword, ResponseLogin } from 'src/dtos/auth.dto';
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

    async returnPassword(confirmPassword: DtoReturnPassword) {
        try {
            const findUser = await this.prismaService.user.findFirst({
                where: {
                    username: confirmPassword.username,
                    identify: confirmPassword.identify
                }
            })

            if (!findUser) {
                badResponse.message = 'Usuario no encontrado.';
                return badResponse;
            }

            await this.prismaService.user.update({
                data: { password: confirmPassword.password },
                where: { id: findUser.id }
            })

            baseResponse.message = 'Contraseña actualizada exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }

    async updatePassword(bodyPassword: DtoPassword) {
        try {
            await this.prismaService.user.update({
                data: { password: bodyPassword.password },
                where: { id: bodyPassword.id }
            })

            baseResponse.message = 'Contraseña actualizada exitosamente.'
            return baseResponse;
        } catch (err) {
            badResponse.message = err.message;
            return badResponse;
        }
    }
}
