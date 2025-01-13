import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RegistrationController],
  providers: [RegistrationService, PrismaService]
})
export class RegistrationModule {}
