import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { PaginatedEmployeeResponse } from './create-paginationResponse.dto';
import { CreateEmployeeDto } from './create-employee.dto';
import { EmployeeService } from './employee.service';

@ApiTags('Get Employee')
@Controller('api/employees')
export class EmployeeController {
  constructor(private readonly employee: EmployeeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all employee' })
  @ApiQuery({
    name: 'first_name',
    type: String,
    required: false,
    description: 'Filter by first name (asc or desc)',
  })
  @ApiQuery({
    name: 'last_name',
    type: String,
    required: false,
    description: 'Filter by last name (asc or desc)',
  })
  @ApiQuery({
    name: 'position',
    type: String,
    required: false,
    description: 'Filter by position (asc or desc)',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    required: false,
    description: 'Number of results per page',
  })
  @ApiOkResponse({
    description: 'Get all employee',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(
    @Query('first_name') firstName: 'asc' | 'desc',
    @Query('last_name') lastName: 'asc' | 'desc',
    @Query('position') position: 'asc' | 'desc',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedEmployeeResponse> {
    return await this.employee.findAll(
      firstName,
      lastName,
      position,
      page,
      size,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create Employee' })
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: '',
        },
        last_name: {
          type: 'string',
          example: '',
        },
        position: {
          type: 'string',
          example: '',
        },
        phone_number: {
          type: 'string',
          example: '',
        },
        email: {
          type: 'string',
          example: '',
        },
      },
      required: [
        'first_name',
        'last_name',
        'position',
        'phone_number',
        'email',
      ],
    },
    description: 'Create Employee',
  })
  @ApiCreatedResponse({
    description: 'Employee created',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async create(@Body() employee: CreateEmployeeDto): Promise<Employee> {
    return await this.employee.create(employee);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Employee' })
  @ApiParam({
    name: 'id',
    type: 'integer',
  })
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(NoFilesInterceptor())
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: '',
        },
        last_name: {
          type: 'string',
          example: '',
        },
        position: {
          type: 'string',
          example: '',
        },
        phone_number: {
          type: 'string',
          example: '',
        },
        email: {
          type: 'string',
          example: '',
        },
      },
    },
    description: 'Update Employee',
  })
  @ApiOkResponse({
    description: 'Employee updated',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async update(
    @Body() employee: Employee,
    @Param('id') id: number,
  ): Promise<Employee> {
    return await this.employee.update(employee, id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'integer',
  })
  @ApiOkResponse({
    description: 'Employee deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async delete(@Param('id') id: number): Promise<Employee> {
    return await this.employee.delete(id);
  }
}
