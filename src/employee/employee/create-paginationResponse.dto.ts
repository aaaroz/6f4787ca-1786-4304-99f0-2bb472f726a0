import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { CreateEmployeeDto } from './create-employee.dto';

export class PaginatedEmployeeResponse {
  @ApiProperty()
  current_page: number;

  @ApiProperty({ type: CreateEmployeeDto, isArray: true })
  data: Employee[];

  @ApiProperty()
  total_items: number;

  @ApiProperty()
  total_pages: number;
}
