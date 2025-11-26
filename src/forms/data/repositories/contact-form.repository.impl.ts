import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ContactFormI } from 'src/forms/domain/entitiesI/ContactFormI';
import { ContactFormRepository } from 'src/forms/domain/repositories/ContactFormRepository';
import { ContactFormEntity } from '../entities/contact-form.entity';
import { CreateFormDto } from '../dtos/create-form.dto';
import { FilterFormsDto } from '../dtos/filter-forms.dto';

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

  async findOne(id: string): Promise<ContactFormI | null> {
    try {
      const form = await this.contactFormRepository.findOne({ where: { id } });
      return form || null;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async updateAtendido(id: string, atendido: boolean): Promise<ContactFormI> {
    try {
      const form = await this.contactFormRepository.findOne({ where: { id } });

      if (!form) {
        throw new RpcException({
          message: 'Formulario no encontrado',
          status: HttpStatus.NOT_FOUND,
        });
      }

      form.atendido = atendido;
      return await this.contactFormRepository.save(form);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: error.status || HttpStatus.BAD_REQUEST,
      });
    }
  }

  async filterForms(filters: FilterFormsDto): Promise<ContactFormI[]> {
    try {
      const queryBuilder = this.contactFormRepository.createQueryBuilder('form');

      if (filters.colonia) {
        queryBuilder.andWhere('form.colonia = :colonia', { colonia: filters.colonia });
      }

      if (filters.municipio) {
        queryBuilder.andWhere('form.municipio = :municipio', { municipio: filters.municipio });
      }

      queryBuilder.orderBy('form.createdAt', 'DESC');

      return await queryBuilder.getMany();
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getStatistics(): Promise<{ totalRegistros: number; registrosAtendidos: number }> {
    try {
      const [totalRegistros, registrosAtendidos] = await Promise.all([
        this.contactFormRepository.count(),
        this.contactFormRepository.count({ where: { atendido: true } }),
      ]);

      return {
        totalRegistros,
        registrosAtendidos,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getTopMunicipalities(limit: number): Promise<Array<{ municipio: string; total: string }>> {
    try {
      return await this.contactFormRepository
        .createQueryBuilder('form')
        .select('form.municipio', 'municipio')
        .addSelect('COUNT(*)', 'total')
        .groupBy('form.municipio')
        .orderBy('total', 'DESC')
        .limit(limit)
        .getRawMany();
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getTopStates(limit: number): Promise<Array<{ estado: string; total: string }>> {
    try {
      return await this.contactFormRepository
        .createQueryBuilder('form')
        .select('form.estado', 'estado')
        .addSelect('COUNT(*)', 'total')
        .groupBy('form.estado')
        .orderBy('total', 'DESC')
        .limit(limit)
        .getRawMany();
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
