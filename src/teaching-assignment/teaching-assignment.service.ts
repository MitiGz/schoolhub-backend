import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeachingAssignmentDto } from './dto/create-teaching-assignment.dto';

@Injectable()
export class TeachingAssignmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAssignmentDto: CreateTeachingAssignmentDto) {
    try {
      return await this.prismaService.teachingAssignment.create({
        data: createAssignmentDto,
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  findAll() {
    return this.prismaService.teachingAssignment.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const assignment = await this.prismaService.teachingAssignment.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!assignment) {
      throw new NotFoundException(`TeachingAssigment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(id: string, updateAssignmentDto: CreateTeachingAssignmentDto) {
    try {
      await this.findOne(id);

      return this.prismaService.teachingAssignment.update({
        where: { id },
        data: updateAssignmentDto,
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return this.prismaService.teachingAssignment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any): never {
    if (error instanceof NotFoundException) {
      throw error;
    }

    if (error.code === 'P2002') {
      throw new ConflictException(
        'Esta asignación (profesor/materia) ya existe.',
      );
    }
    if (error.code === 'P2003') {
      throw new BadRequestException(
        'El profesor, materia o curso especificado no existe.',
      );
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(
        'La asignación que se intenta eliminar no existe.',
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, please check server logs.',
    );
  }
}
