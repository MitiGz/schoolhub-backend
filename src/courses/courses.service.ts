import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@generated/client/client';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      return await this.prismaService.course.create({
        data: createCourseDto,
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  findAll() {
    return this.prismaService.course.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string) {
    const course = await this.prismaService.course.findFirst({
      where: { id, deletedAt: null },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      await this.findOne(id);

      const dataToUpdate: Prisma.CourseUpdateInput = { ...updateCourseDto };

      return this.prismaService.course.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prismaService.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private handleDBError(error: any): never {
    if (
      error instanceof NotFoundException ||
      error instanceof ConflictException
    )
      throw error;

    if (error.code === 'P2002') {
      if (error.meta.target.includes('name')) {
        throw new ConflictException(
          `Name course already exists.`,
        );
      }
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(
        'El curso no fue encontrado para esta operación.',
      );
    }

    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, please check server logs.',
    );
  }
}
