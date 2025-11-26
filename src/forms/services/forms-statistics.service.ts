import { Inject, Injectable } from '@nestjs/common';
import { ContactFormRepository } from '../domain/repositories/ContactFormRepository';
import { ContactFormRepositoryImpl } from '../data/repositories/contact-form.repository.impl';
import { StatsResponseDto } from '../data/dtos/stats-response.dto';
import { TopMunicipalityDto } from '../data/dtos/top-municipality.dto';
import { TopStateDto } from '../data/dtos/top-state.dto';
import { ContactFormMapper } from './contact-form.mapper';
import { HandleServiceError } from '../../common/decorators/handle-service-error.decorator';

/**
 * Servicio especializado en análisis y estadísticas de formularios
 * Responsabilidades:
 * - Obtener estadísticas generales
 * - Calcular top municipios
 * - Calcular top estados
 * - Análisis de tendencias (futuro)
 */
@Injectable()
export class FormsStatisticsService {
  constructor(
    @Inject(ContactFormRepositoryImpl)
    private readonly contactFormRepository: ContactFormRepository,
    private readonly mapper: ContactFormMapper,
  ) {}

  /**
   * Obtiene estadísticas generales de los formularios
   */
  @HandleServiceError('Error al obtener estadísticas')
  async getStats(): Promise<StatsResponseDto> {
    const stats = await this.contactFormRepository.getStatistics();

    return {
      totalRegistros: stats.totalRegistros,
      registrosAtendidos: stats.registrosAtendidos,
      registrosNoAtendidos: stats.totalRegistros - stats.registrosAtendidos,
    };
  }

  /**
   * Obtiene el top 6 de municipios con más registros
   */
  @HandleServiceError('Error al obtener top municipios')
  async getTopMunicipalities(limit: number = 6): Promise<TopMunicipalityDto[]> {
    const topMunicipalities = await this.contactFormRepository.getTopMunicipalities(limit);
    return this.mapper.toTopMunicipalityDtos(topMunicipalities);
  }

  /**
   * Obtiene el top 6 de estados con más registros
   */
  @HandleServiceError('Error al obtener top estados')
  async getTopStates(limit: number = 6): Promise<TopStateDto[]> {
    const topStates = await this.contactFormRepository.getTopStates(limit);
    return this.mapper.toTopStateDtos(topStates);
  }
}
