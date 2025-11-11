import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto';
import { TeachingAssignmentService } from './teaching-assignment.service';

@Controller('teaching-assignment')
export class TeachingAssignmentController {
  constructor(
    private readonly teachingAssignmentService: TeachingAssignmentService,
  ) {}

  @Post()
  create(@Body() createTeachingAssignmentDto: CreateTeachingAssignmentDto) {
    return this.teachingAssignmentService.create(createTeachingAssignmentDto);
  }

  @Get()
  findAll() {
    return this.teachingAssignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingAssignmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeachingAssignmentDto: CreateTeachingAssignmentDto) {
    return this.teachingAssignmentService.update(id, updateTeachingAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingAssignmentService.remove(id);
  }
}
