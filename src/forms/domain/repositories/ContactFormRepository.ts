import { CreateFormDto } from 'src/forms/data/dtos/create-form.dto';
import { FilterFormsDto } from 'src/forms/data/dtos/filter-forms.dto';
import { ContactFormI } from '../entitiesI/ContactFormI';

/**
 * Interfaz del repositorio de formularios de contacto
 * Define todos los métodos de acceso a datos
 */
export interface ContactFormRepository {
  // CRUD Operations
  create(createFormDto: CreateFormDto): Promise<ContactFormI>;
  findAll(): Promise<ContactFormI[]>;
  findOne(id: string): Promise<ContactFormI | null>;
  updateAtendido(id: string, atendido: boolean): Promise<ContactFormI>;

  // Query Operations
  filterForms(filters: FilterFormsDto): Promise<ContactFormI[]>;

  // Statistics Operations
  getStatistics(): Promise<{
    totalRegistros: number;
    registrosAtendidos: number;
  }>;

  getTopMunicipalities(limit: number): Promise<Array<{
    municipio: string;
    total: string;
  }>>;

  getTopStates(limit: number): Promise<Array<{
    estado: string;
    total: string;
  }>>;
} 