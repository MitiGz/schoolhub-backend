import { Prisma } from '@generated/client/client';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.user.findMany({
      where: { deletedAt: null },
    });

    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.prismaService.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: { id: id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword; // Exclude password from the returned user object
  }

async  findOneByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email: email, deletedAt: null },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const { password, ...userData } = updateUserDto;

    const dataToUpdate: Prisma.UserUpdateInput = {
      ...userData,
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const user = await this.prismaService.user.update({
      where: { id },
      data: dataToUpdate,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prismaService.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private handleDBError(error: any): never {
    if (error.code === 'P2002') {
      if (error.meta.target.includes('email')) {
        throw new ConflictException('El email ya existe.');
      }
    }
    if (error.code === 'P2025') {
      throw new NotFoundException(
        'El registro que intentas actualizar no fue encontrado.',
      );
    }
    throw new InternalServerErrorException(
      'Error inesperado, revisa los logs del servidor.',
    );
  }
}
