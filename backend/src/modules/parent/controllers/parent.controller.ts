import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { handleResponse } from 'src/common/utils';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('all')
  async findAll() {
    try {
      const data = await this.parentService.getAllParents();
      return handleResponse(data);
    } catch (error) {
      return handleResponse(error, HttpStatus.BAD_REQUEST);
    }
  }
}
