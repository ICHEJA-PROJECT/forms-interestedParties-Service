import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { FormsService } from '../services/forms.service';
import { CreateFormDto } from '../data/dtos/create-form.dto';
import { FormResponseDto } from '../data/dtos/form-response.dto';
import { FilterFormsDto } from '../data/dtos/filter-forms.dto';
import { StatsResponseDto } from '../data/dtos/stats-response.dto';
import { TopMunicipalityDto } from '../data/dtos/top-municipality.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

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
    return await this.formsService.getStats();
  }

  @Get('top-municipalities')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 por minuto
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener top 5 municipios con más registros (Requiere autenticación)' })
  @ApiResponse({
    status: 200,
    description: 'Top municipios obtenidos exitosamente',
    type: [TopMunicipalityDto]
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async getTopMunicipalities(): Promise<TopMunicipalityDto[]> {
    return await this.formsService.getTopMunicipalities();
  }


  @Get('top-states')
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 429, description: 'Demasiadas peticiones' })
  async getTopStates() {
    return await this.formsService.getTopStates();
  }
}
