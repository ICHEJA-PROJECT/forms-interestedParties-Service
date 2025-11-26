import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ContactFormI } from 'src/forms/domain/entitiesI/ContactFormI';
import { ContactFormRepository } from 'src/forms/domain/repositories/ContactFormRepository';
import { ContactFormEntity } from '../entities/contact-form.entity';
import { CreateFormDto } from '../dtos/create-form.dto';

@Injectable()
export class ContactFormRepositoryImpl implements ContactFormRepository {
  constructor(
    @InjectRepository(ContactFormEntity)
    private readonly contactFormRepository: Repository<ContactFormEntity>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<ContactFormI> {
    try {
      const contactForm = this.contactFormRepository.create(createFormDto);
      return await this.contactFormRepository.save(contactForm);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(): Promise<ContactFormI[]> {
    try {
      const forms = await this.contactFormRepository.find({
        order: { createdAt: 'DESC' },
      });
      return forms;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findOne(id: string): Promise<ContactFormI> {
    try {
      const form = await this.contactFormRepository.findOne({ where: { id } });
      if (!form) {
        throw new RpcException({
          message: 'El formulario solicitado no existe.',
          status: HttpStatus.NOT_FOUND,
        });
      }
      return form;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
