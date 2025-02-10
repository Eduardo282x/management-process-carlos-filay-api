import { Injectable } from '@nestjs/common';
import { Activities } from '@prisma/client';
import { DtoBaseResponse, baseResponse, badResponse } from 'src/dtos/base.dto';
import { DtoActivities, DtoUpdateActivities } from 'src/dtos/grade.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivitiesService {

    constructor(private prismaService: PrismaService) {
        
    }

    async getActivities(): Promise<Activities[]> {
        return await this.prismaService.activities.findMany({
            include: {
                subjects: {
                    include: {
                        Grades: true
                    }
                }
            },
            orderBy: {id: 'asc'}
        });
    }

    async createActivities(activity: DtoActivities): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.activities.create({
                data: {
                    activity: activity.activity,
                    subjectId: activity.subjectId,
                    dateActivity: new Date()
                }
            })
            baseResponse.message = 'Actividad agregada.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }

    async updateActivities(activity: DtoUpdateActivities): Promise<DtoBaseResponse> {
        try {
            await this.prismaService.activities.update({
                data: {
                    activity: activity.activity,
                    subjectId: activity.subjectId
                },
                where: {
                    id: activity.id
                }
            })
            baseResponse.message = 'Actividad actualizada.'
            return baseResponse;
        } catch (err) {
            baseResponse.message += err;
            return badResponse;
        }
    }
}
