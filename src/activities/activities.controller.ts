import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { DtoActivities, DtoUpdateActivities } from 'src/dtos/grade.dto';

@Controller('activities')
export class ActivitiesController {

    constructor(private activitiesService: ActivitiesService) {

    }

    @Get()
    async getActivities() {
        return await this.activitiesService.getActivities();
    }
    @Post()
    async createActivities(@Body() activity: DtoActivities) {
        return await this.activitiesService.createActivities(activity);
    }
    @Put()
    async updateActivities(@Body() activity: DtoUpdateActivities) {
        return await this.activitiesService.updateActivities(activity);
    }
}
