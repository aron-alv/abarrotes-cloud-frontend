export interface Categoria {
  id: string;
  tiendaId: string;
  nombre: string;
}
export interface CategoriaCreateDTO
{
    tiendaId: string;
    nombre: string;
}
export interface CategoriaUpdateDTO
{
    id: string;
    tiendaId: string;
    nombre: string;
}
export interface eliminarCategoriaDTO
{
    id: string;
    tiendaId: string;
    usuarioId: string;
}

export interface MovimientoKardex {
  id: string;
  tiendaId: string;
  productoId: string;
  tipoMovimiento: string; 
  cantidad: number;
  motivo: string;
  fechaRegistro: string;
  productoNombre?: string; 
  usuarioNombre?: string; 
}

export interface KardexCreateDTO {
  tiendaId: string;
  productoId: string;
  usuarioId: string;
  tipoMovimiento: string;
  cantidad: number;
  motivo: string;
}