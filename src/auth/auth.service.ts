import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  //Este método valida las credenciales del usuario
  async validateUser(email: string, password: string): Promise<any> {
    let user;
    try {
      user = await this.usersService.findOneByEmail(email);
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    throw new UnauthorizedException('Credenciales inválidas.');
  }

  //Este método genera un token JWT para el usuario autenticado
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  // Este método registra un nuevo usuario
  async register(registerDto: RegisterDto) {
    const { email, firstName, lastName, password } = registerDto;

    const existingUser = await this.usersService.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException('El email ya está en uso.');
    }

    const createUserDto: CreateUserDto = {
      email,
      firstName,
      lastName,
      password: password,
    };

    try {
      const newUser = await this.usersService.create(createUserDto);

      const payload = {
        sub: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };
      return {
        message: 'Usuario registrado exitosamente',
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al registrar el usuario.');
    }
  }
}
