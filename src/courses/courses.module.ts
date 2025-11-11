import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [PrismaModule],
})
export class CoursesModule {}
