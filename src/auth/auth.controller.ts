import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DtoLogin, DtoPassword, DtoReturnPassword, ResponseLogin } from 'src/dtos/auth.dto';
import { DtoBaseResponse } from 'src/dtos/base.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    async authLogin(@Body() userLogin: DtoLogin): Promise<ResponseLogin | DtoBaseResponse> {
        return await this.authService.login(userLogin);
    }

    @Put()
    async returnPassword(@Body() confirmPassword: DtoReturnPassword) {
        return await this.authService.returnPassword(confirmPassword);
    }

    @Put('/password')
    async updatePassword(@Body() bodyPassword: DtoPassword) {
        return await this.authService.updatePassword(bodyPassword);
    }
}
