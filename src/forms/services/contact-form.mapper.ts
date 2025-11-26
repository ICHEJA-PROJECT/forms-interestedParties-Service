import { Injectable } from '@nestjs/common';
import { ContactFormI } from '../domain/entitiesI/ContactFormI';
import { FormResponseDto } from '../data/dtos/form-response.dto';
import { TopMunicipalityDto } from '../data/dtos/top-municipality.dto';
import { TopStateDto } from '../data/dtos/top-state.dto';

@Injectable()
export class ContactFormMapper {
  /**
   * Convierte una entidad de dominio a DTO de respuesta
   */
  toResponseDto(form: ContactFormI): FormResponseDto {
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

  /**
   * Convierte un array de entidades a array de DTOs
   */
  toResponseDtos(forms: ContactFormI[]): FormResponseDto[] {
    return forms.map(form => this.toResponseDto(form));
  }

  /**
   * Convierte estadísticas de municipios a DTOs
   */
  toTopMunicipalityDto(data: { municipio: string; total: string }): TopMunicipalityDto {
    return {
      municipio: data.municipio,
      totalRegistros: parseInt(data.total, 10),
    };
  }

  /**
   * Convierte array de estadísticas de municipios a DTOs
   */
  toTopMunicipalityDtos(data: { municipio: string; total: string }[]): TopMunicipalityDto[] {
    return data.map(item => this.toTopMunicipalityDto(item));
  }

  /**
   * Convierte estadísticas de estados a DTOs
   */
  toTopStateDto(data: { estado: string; total: string }): TopStateDto {
    return {
      estado: data.estado,
      totalRegistros: parseInt(data.total, 10),
    };
  }

  /**
   * Convierte array de estadísticas de estados a DTOs
   */
  toTopStateDtos(data: { estado: string; total: string }[]): TopStateDto[] {
    return data.map(item => this.toTopStateDto(item));
  }
}
