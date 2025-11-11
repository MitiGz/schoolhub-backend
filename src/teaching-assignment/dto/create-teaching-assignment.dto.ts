import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeachingAssignmentDto {
  // ApiProperty es una decoración que ayuda a documentar la API con Swagger
  @ApiProperty({
    description: 'ID del profesor (User con rol TEACHER) a asignar.',
    example: 'clxolv7o60000u01e7m0e1b1b',
  })
  @IsNotEmpty({ message: 'El ID del profesor no puede estar vacío.' })
  @IsString({ message: 'El ID del profesor debe ser un CUID válido.' })
  teacherId: string;

  @ApiProperty({
    description: 'ID de la materia (Subject) a la que se asigna el profesor.',
    example: 'clxolv8c90001u01e8m0e2c2c',
  })
  @IsNotEmpty({ message: 'El ID de la materia no puede estar vacío.' })
  @IsString({ message: 'El ID de la materia debe ser un string.' })
  subjectId: string;
}
