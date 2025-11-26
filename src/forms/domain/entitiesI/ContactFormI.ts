export interface ContactFormI {
  id: string;
  nombre: string;
  apellidos: string;
  numeroTelefono: string;
  email: string;
  calle: string;
  numeroExterior: string;
  codigoPostal: string;
  colonia: string;
  municipio: string;
  estado: string;
  comunidadPerteneciente: string;
  porQueMeInteresa: string;
  atendido: boolean;
  createdAt: Date;
  updatedAt: Date;
}
