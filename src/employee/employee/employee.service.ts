import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Employee } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { CreateEmployeeDto } from './create-employee.dto';
import { EmployeeController } from './employee.controller';
import { PaginatedEmployeeResponse } from './create-paginationResponse.dto';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeController.name);
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    firstNameOrder: 'asc' | 'desc',
    lastNameOrder: 'asc' | 'desc',
    positionOrder: 'asc' | 'desc',
    page: number,
    size: number,
  ): Promise<PaginatedEmployeeResponse> {
    const skip = (Number(page) - 1) * Number(size);

    const orderBy: Prisma.EmployeeOrderByWithRelationInput[] = [];
    if (firstNameOrder) orderBy.push({ first_name: firstNameOrder });
    if (lastNameOrder) orderBy.push({ last_name: lastNameOrder });
    if (positionOrder) orderBy.push({ position: positionOrder });

    const [employees, totalItems] = await Promise.all([
      this.prisma.employee.findMany({
        orderBy,
        skip,
      }),
      this.prisma.employee.count(),
    ]);

    const totalPages = Math.ceil(totalItems / Number(size));

    return {
      current_page: Number(page),
      data: employees,
      total_items: totalItems,
      total_pages: totalPages,
    };
  }

  async create(employee: CreateEmployeeDto): Promise<Employee> {
    try {
      const existingEmailEmployee = await this.prisma.employee.findUnique({
        where: { email: employee.email },
      });

      if (existingEmailEmployee) {
        throw new BadRequestException('Email already exists');
      }

      const existingPhoneNumberEmployee = await this.prisma.employee.findUnique(
        {
          where: { phone_number: employee.phone_number },
        },
      );

      if (existingPhoneNumberEmployee) {
        throw new BadRequestException('Phone number already exists');
      }

      return this.prisma.employee.create({
        data: employee,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(employee: Employee, id: number): Promise<Employee> {
    try {
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { id: Number(id) },
      });

      if (!existingEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      if (employee.email && employee.email !== existingEmployee.email) {
        const existingEmailEmployee = await this.prisma.employee.findUnique({
          where: { email: employee.email },
        });

        if (existingEmailEmployee) {
          throw new BadRequestException('Email already exists');
        }
      }

      if (
        employee.phone_number &&
        employee.phone_number !== existingEmployee.phone_number
      ) {
        const existingPhoneNumberEmployee =
          await this.prisma.employee.findUnique({
            where: { phone_number: employee.phone_number },
          });

        if (existingPhoneNumberEmployee) {
          throw new BadRequestException('Phone number already exists');
        }
      }

      const dataToUpdate = {
        first_name: employee.first_name || existingEmployee.first_name,
        last_name: employee.last_name || existingEmployee.last_name,
        position: employee.position || existingEmployee.position,
        phone_number: employee.phone_number || existingEmployee.phone_number,
        email: employee.email || existingEmployee.email,
      };

      return this.prisma.employee.update({
        where: { id: Number(id) },
        data: dataToUpdate,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async delete(id: number): Promise<Employee> {
    try {
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { id: Number(id) },
      });

      if (!existingEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return this.prisma.employee.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
