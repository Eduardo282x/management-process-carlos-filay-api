import { Controller, Get } from '@nestjs/common';
import { DtoBaseResponse } from 'src/dtos/base.dto';
import { MainloadService } from './mainload.service';

@Controller('mainload')
export class MainloadController {

    constructor(private mainloadService: MainloadService) {}

    @Get()
    async getMainLoad(): Promise<DtoBaseResponse>{
        return await this.mainloadService.loadData();
    }

}
