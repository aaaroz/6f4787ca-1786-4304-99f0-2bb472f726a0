import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [PrismaModule, EmployeeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
