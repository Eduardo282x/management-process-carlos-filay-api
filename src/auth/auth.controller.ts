import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DtoLogin, ResponseLogin } from 'src/dtos/auth.dto';
import { DtoBaseResponse } from 'src/dtos/base.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post()
    async authLogin(@Body() userLogin: DtoLogin): Promise<ResponseLogin | DtoBaseResponse> {
        return await this.authService.login(userLogin);
    }
}
