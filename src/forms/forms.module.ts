import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsController } from './controllers/forms.controller';
import { FormsService } from './services/forms.service';
import { ContactFormEntity } from './data/entities/contact-form.entity';
import { ContactFormRepositoryImpl } from './data/repositories/contact-form.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ContactFormEntity])],
  controllers: [FormsController],
  providers: [ContactFormRepositoryImpl, FormsService],
  exports: [FormsService],
})
export class FormsModule {}
