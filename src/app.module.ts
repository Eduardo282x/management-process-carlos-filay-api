import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { MainloadModule } from './mainload/mainload.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { PaymentsModule } from './payments/payments.module';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [AuthModule, MainloadModule, UsersModule, StudentsModule, PaymentsModule, RegistrationModule],
  providers: [PrismaService],
})
export class AppModule {}
