export interface Producto {
  id: string;
  tiendaId: string;
  categoriaId: string;
  nombre: string;
  codigoBarras: string;
  preciocompra: number;
  precioventa: number;
  stock: number;
  tipoUnidad: string;
}

export interface ProductoCreateDTO {
  tiendaId: string;
  categoriaId: string;
  nombre: string;
  codigoBarras: string;
  preciocompra: number;
  precioventa: number;
  stock: number;
  tipoUnidad: string;
}

export interface eliminarProductoDTO {
  id: string;
  tiendaId: string;
  usuarioId: string;
}

export interface ProductoUpdateDTO {
 productoId : string;
 tiendaId: string;
 usuarioId: string;
 categoriaId: string;
 codigoBarras: string;
 nombre: string;
 precioCompra: number;
 precioVenta: number;
 tipoUnidad: string;
 stockMinimo: number;
}