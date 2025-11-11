import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [PrismaModule],
})
export class SubjectsModule {}
