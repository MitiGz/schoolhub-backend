import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@generated/client/client';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prismaService: PrismaService) {}
  
    async create(createSubjectDto: CreateSubjectDto) {
      try {
        return await this.prismaService.subject.create({
          data: createSubjectDto,
        });
      } catch (error) {
        this.handleDBError(error);
      }
    }
  
    findAll() {
      return this.prismaService.subject.findMany({
        where: { deletedAt: null },
      });
    }
  
    async findOne(id: string) {
      const subject = await this.prismaService.subject.findFirst({
        where: { id, deletedAt: null },
      });
  
      if (!subject) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
  
      return subject;
    }
  
    async update(id: string, updateSubjectDto: UpdateSubjectDto) {
      try {
        await this.findOne(id);
  
        const dataToUpdate: Prisma.SubjectUpdateInput = { ...updateSubjectDto };
  
        return this.prismaService.subject.update({
          where: { id },
          data: dataToUpdate,
        });
      } catch (error) {
        this.handleDBError(error);
      }
    }
  
    async remove(id: string) {
      await this.findOne(id);
  
      return this.prismaService.subject.update({
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
            `Name subject already exists.`,
          );
        }
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'La materia no fue encontrada para esta operación.',
        );
      }
  
      console.log(error);
      throw new InternalServerErrorException(
        'Unexpected error, please check server logs.',
      );
    }
}
