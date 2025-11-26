import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsController } from './controllers/forms.controller';
import { FormsService } from './services/forms.service';
import { FormsStatisticsService } from './services/forms-statistics.service';
import { ContactFormMapper } from './services/contact-form.mapper';
import { ContactFormEntity } from './data/entities/contact-form.entity';
import { ContactFormRepositoryImpl } from './data/repositories/contact-form.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([ContactFormEntity])],
  controllers: [FormsController],
  providers: [
    ContactFormRepositoryImpl,
    FormsService,
    FormsStatisticsService,
    ContactFormMapper,
  ],
  exports: [FormsService, FormsStatisticsService],
})
export class FormsModule {}
