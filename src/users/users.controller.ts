import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { DtoUser, DtoUpdateUser } from 'src/dtos/user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Get()
    async getUsers(): Promise<User[]> {
        return await this.userService.getUsers();
    }

    @Get('/roles')
    async getRoles() {
        return await this.userService.getRoles();
    }

    @Post()
    async createUser(@Body() newUser: DtoUser) {
        return await this.userService.createUser(newUser);
    }

    @Put()
    async updateUser(@Body() user: DtoUpdateUser) {
        return await this.userService.updateUser(user);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.deleteUser(Number(id));
    }
}
