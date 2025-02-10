import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { MainloadModule } from './mainload/mainload.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { PaymentsModule } from './payments/payments.module';
import { RegistrationModule } from './registration/registration.module';
import { NotesModule } from './notes/notes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { ActivitiesModule } from './activities/activities.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [AuthModule, MainloadModule, UsersModule, StudentsModule, PaymentsModule, RegistrationModule, NotesModule, SubjectsModule, ActivitiesModule, GradesModule],
  providers: [PrismaService],
})
export class AppModule {}
