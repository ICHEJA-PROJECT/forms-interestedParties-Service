import { CreateFormDto } from 'src/forms/data/dtos/create-form.dto';
import { ContactFormI } from '../entitiesI/ContactFormI';

export interface ContactFormRepository {
  create(createFormDto: CreateFormDto): Promise<ContactFormI>;
  findAll(): Promise<ContactFormI[]>;
  findOne(id: string): Promise<ContactFormI>;
} 