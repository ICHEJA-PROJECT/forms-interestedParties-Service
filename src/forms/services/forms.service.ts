import { Inject, Injectable } from '@nestjs/common';
import { ContactFormRepository } from '../domain/repositories/ContactFormRepository';
import { ContactFormRepositoryImpl } from '../data/repositories/contact-form.repository.impl';
import { CreateFormDto } from '../data/dtos/create-form.dto';
import { FormResponseDto } from '../data/dtos/form-response.dto';
import { FilterFormsDto } from '../data/dtos/filter-forms.dto';
import { ContactFormMapper } from './contact-form.mapper';
import { HandleServiceError } from '../../common/decorators/handle-service-error.decorator';

/**
 * Servicio principal de gestión de formularios
 * Responsabilidades:
 * - Crear formularios
 * - Recuperar formularios
 * - Filtrar formularios por criterios
 */
@Injectable()
export class FormsService {
  constructor(
    @Inject(ContactFormRepositoryImpl)
    private readonly contactFormRepository: ContactFormRepository,
    private readonly mapper: ContactFormMapper,
  ) {}

  /**
   * Crea un nuevo formulario de contacto
   */
  @HandleServiceError('Error al guardar el formulario de contacto')
  async create(createFormDto: CreateFormDto): Promise<FormResponseDto> {
    const contactForm = await this.contactFormRepository.create(createFormDto);
    return this.mapper.toResponseDto(contactForm);
  }

  /**
   * Recupera todos los formularios
   */
  @HandleServiceError('Error al obtener los formularios de contacto')
  async findAll(): Promise<FormResponseDto[]> {
    const forms = await this.contactFormRepository.findAll();
    return this.mapper.toResponseDtos(forms);
  }

  /**
   * Filtra formularios por colonia y/o municipio
   */
  @HandleServiceError('Error al filtrar los formularios')
  async filterForms(filterDto: FilterFormsDto): Promise<FormResponseDto[]> {
    const forms = await this.contactFormRepository.filterForms(filterDto);
    return this.mapper.toResponseDtos(forms);
  }

  /**
   * Actualiza el estado de atendido de un formulario
   */
  @HandleServiceError('Error al actualizar el estado del formulario')
  async updateAtendido(id: string, atendido: boolean): Promise<FormResponseDto> {
    const form = await this.contactFormRepository.updateAtendido(id, atendido);
    return this.mapper.toResponseDto(form);
  }
}
