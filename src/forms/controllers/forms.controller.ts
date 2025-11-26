import { Body, Controller, Get, Post, Query, UseGuards, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FormsService } from '../services/forms.service';
import { FormsStatisticsService } from '../services/forms-statistics.service';
import { CreateFormDto } from '../data/dtos/create-form.dto';
import { UpdateAtendidoDto } from '../data/dtos/update-atendido.dto';
import { FormResponseDto } from '../data/dtos/form-response.dto';
import { FilterFormsDto } from '../data/dtos/filter-forms.dto';
import { StatsResponseDto } from '../data/dtos/stats-response.dto';
import { TopMunicipalityDto } from '../data/dtos/top-municipality.dto';
import { TopStateDto } from '../data/dtos/top-state.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly statisticsService: FormsStatisticsService,
  ) {}

  @Post()
  @Throttle({ default: { limit: 100000, ttl: 60000 } }) // 100k por minuto (para pruebas de estrés)
  @ApiOperation({ summary: 'Crear un nuevo formulario de contacto' })
  @ApiBody({ type: CreateFormDto })
  @ApiResponse({
    status: 201,
    description: 'Formulario creado exitosamente',
    type: FormResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async create(@Body() createFormDto: CreateFormDto): Promise<FormResponseDto> {
    return await this.formsService.create(createFormDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener todos los formularios de contacto (Requiere autenticación)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de formularios obtenida exitosamente',
    type: [FormResponseDto]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async findAll(): Promise<FormResponseDto[]> {
    return await this.formsService.findAll();
  }

  @Get('filter')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Filtrar formularios por colonia y/o municipio (Requiere autenticación)' })
  @ApiQuery({ name: 'colonia', required: false, description: 'Filtrar por colonia' })
  @ApiQuery({ name: 'municipio', required: false, description: 'Filtrar por municipio' })
  @ApiResponse({
    status: 200,
    description: 'Formularios filtrados exitosamente',
    type: [FormResponseDto]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async filterForms(@Query() filterDto: FilterFormsDto): Promise<FormResponseDto[]> {
    return await this.formsService.filterForms(filterDto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener estadísticas de registros (Requiere autenticación)' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    type: StatsResponseDto
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async getStats(): Promise<StatsResponseDto> {
    return await this.statisticsService.getStats();
  }

  @Get('top-municipalities')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener top 6 municipios con más registros (Requiere autenticación)' })
  @ApiResponse({
    status: 200,
    description: 'Top municipios obtenidos exitosamente',
    type: [TopMunicipalityDto]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async getTopMunicipalities(): Promise<TopMunicipalityDto[]> {
    return await this.statisticsService.getTopMunicipalities();
  }


  @Get('top-states')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener top 6 estados con más registros (Requiere autenticación)' })
  @ApiResponse({
    status: 200,
    description: 'Top estados obtenidos exitosamente',
    type: [TopStateDto]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async getTopStates(): Promise<TopStateDto[]> {
    return await this.statisticsService.getTopStates();
  }

  @Patch(':id/atendido')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar estado de atendido de un formulario (Requiere autenticación)' })
  @ApiParam({
    name: 'id',
    description: 'ID del formulario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateAtendidoDto })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: FormResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Formulario no encontrado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async updateAtendido(
    @Param('id') id: string,
    @Body() updateAtendidoDto: UpdateAtendidoDto,
  ): Promise<FormResponseDto> {
    return await this.formsService.updateAtendido(id, updateAtendidoDto.atendido);
  }
}
