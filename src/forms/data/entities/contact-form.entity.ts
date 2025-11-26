import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ContactFormI } from 'src/forms/domain/entitiesI/ContactFormI';

@Entity('contact_forms')
export class ContactFormEntity implements ContactFormI {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'nombre' })
  nombre: string;

  @Column({ type: 'varchar', length: 100, name: 'apellidos' })
  apellidos: string;

  @Column({ type: 'varchar', length: 20, name: 'numero_telefono' })
  numeroTelefono: string;

  @Column({ type: 'varchar', length: 150, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 200, name: 'calle' })
  calle: string;

  @Column({ type: 'varchar', length: 10, name: 'numero_exterior' })
  numeroExterior: string;

  @Column({ type: 'varchar', length: 10, name: 'codigo_postal' })
  codigoPostal: string;

  @Column({ type: 'varchar', length: 100, name: 'colonia' })
  colonia: string;

  @Column({ type: 'varchar', length: 100, name: 'municipio' })
  municipio: string;

  @Column({ type: 'varchar', length: 100, name: 'estado' })
  estado: string;

  @Column({ type: 'varchar', length: 100, name: 'comunidad_perteneciente', nullable: true })
  comunidadPerteneciente: string;

  @Column({ type: 'text', name: 'por_que_me_interesa' })
  porQueMeInteresa: string;

  @Column({ type: 'boolean', name: 'atendido', default: false })
  atendido: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
