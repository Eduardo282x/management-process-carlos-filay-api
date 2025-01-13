import { Injectable } from '@nestjs/common';
import { Roles, User } from '@prisma/client';
import { badResponse, baseResponse, DtoBaseResponse } from 'src/dtos/base.dto';
import { DtoUser, DtoUpdateUser } from 'src/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {

    constructor(private prismaService: PrismaService) { }

    async getUsers(): Promise<User[]> {
        return await this.prismaService.user.findMany({
            include: {
                rol: true
            },
            orderBy:{
                id: 'asc'
            }
        });
    }

    async getRoles(): Promise<Roles[]> {
        return await this.prismaService.roles.findMany();
    }

    async createUser(newUser: DtoUser): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.user.create({
                data: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    username: newUser.firstName,
                    identify: newUser.identify,
                    password: newUser.identify,
                    rolId: newUser.rolId,
                    status: newUser.status,
                },
            });
            baseResponse.message = 'Usuario creado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }

    async updateUser(user: DtoUpdateUser): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.user.update({
                data: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.firstName,
                    identify: user.identify,
                    rolId: user.rolId,
                    status: user.status,
                },
                where: {
                    id: user.id
                }
            });
            baseResponse.message = 'Usuario actualizado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }

    async deleteUser(id: number): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.user.delete({
                where: {
                    id: id
                }
            });
            baseResponse.message = 'Usuario eliminado exitosamente';
            return baseResponse;
        } catch (err) {
            badResponse.message += err.message;
            return badResponse;
        }
    }
}
