import { Controller, Get, HttpStatus } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { handleResponse } from 'src/common/utils';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('all')
  async findAll() {
    try {
      const data = await this.studentService.getAllStudents();
      return handleResponse(data);
    } catch (error) {
      return handleResponse(error, HttpStatus.BAD_REQUEST);
    }
  }
}
