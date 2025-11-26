import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ContactFormRepository } from '../domain/repositories/ContactFormRepository';
import { ContactFormRepositoryImpl } from '../data/repositories/contact-form.repository.impl';
import { CreateFormDto } from '../data/dtos/create-form.dto';
import { FormResponseDto } from '../data/dtos/form-response.dto';
import { FilterFormsDto } from '../data/dtos/filter-forms.dto';
import { StatsResponseDto } from '../data/dtos/stats-response.dto';
import { TopMunicipalityDto } from '../data/dtos/top-municipality.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactFormEntity } from '../data/entities/contact-form.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormsService {
  constructor(
    @Inject(ContactFormRepositoryImpl)
    private readonly contactFormRepository: ContactFormRepository,
    @InjectRepository(ContactFormEntity)
    private readonly formRepository: Repository<ContactFormEntity>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<FormResponseDto> {
    try {
      const contactForm = await this.contactFormRepository.create(createFormDto);
      return this.mapToResponseDto(contactForm);
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error al guardar el formulario de contacto',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findAll(): Promise<FormResponseDto[]> {
    try {
      const forms = await this.contactFormRepository.findAll();
      return forms.map(form => this.mapToResponseDto(form));
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error al obtener los formularios de contacto',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async filterForms(filterDto: FilterFormsDto): Promise<FormResponseDto[]> {
    try {
      const queryBuilder = this.formRepository.createQueryBuilder('form');

      if (filterDto.colonia) {
        queryBuilder.andWhere('form.colonia = :colonia', { colonia: filterDto.colonia });
      }

      if (filterDto.municipio) {
        queryBuilder.andWhere('form.municipio = :municipio', { municipio: filterDto.municipio });
      }

      queryBuilder.orderBy('form.createdAt', 'DESC');

      const forms = await queryBuilder.getMany();
      return forms.map(form => this.mapToResponseDto(form));
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error al filtrar los formularios',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getStats(): Promise<StatsResponseDto> {
    try {
      const [totalRegistros, registrosAtendidos] = await Promise.all([
        this.formRepository.count(),
        this.formRepository.count({ where: { atendido: true } }),
      ]);

      return {
        totalRegistros,
        registrosAtendidos,
        registrosNoAtendidos: totalRegistros - registrosAtendidos,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error al obtener estadísticas',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getTopMunicipalities(): Promise<TopMunicipalityDto[]> {
    try {
      const topMunicipalities = await this.formRepository
        .createQueryBuilder('form')
        .select('form.municipio', 'municipio')
        .addSelect('COUNT(*)', 'total')
        .groupBy('form.municipio')
        .orderBy('total', 'DESC')
        .limit(6)
        .getRawMany();

      return topMunicipalities.map(item => ({
        municipio: item.municipio,
        totalRegistros: parseInt(item.total, 10),
      }));
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error al obtener top municipios',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getTopStates(){
    try {
      const topMunicipalities = await this.formRepository
        .createQueryBuilder('form')
        .select('form.estado', 'estado')
        .addSelect('COUNT(*)', 'total')
        .groupBy('form.estado')
        .orderBy('total', 'DESC')
        .limit(6)
        .getRawMany();

      return topMunicipalities.map(item => ({
        municipio: item.estado,
        totalRegistros: parseInt(item.total, 10),
      }));
      
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Error al obtener top municipios',
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private mapToResponseDto(form: any): FormResponseDto {
    return {
      id: form.id,
      nombre: form.nombre,
      apellidos: form.apellidos,
      numeroTelefono: form.numeroTelefono,
      email: form.email,
      calle: form.calle,
      numeroExterior: form.numeroExterior,
      codigoPostal: form.codigoPostal,
      colonia: form.colonia,
      municipio: form.municipio,
      estado: form.estado,
      comunidadPerteneciente: form.comunidadPerteneciente,
      porQueMeInteresa: form.porQueMeInteresa,
      atendido: form.atendido,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    };
  }
}
