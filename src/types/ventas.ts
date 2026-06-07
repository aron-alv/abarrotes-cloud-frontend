export interface Venta {
  id: string;
  tiendaId: string;
  usuarioId: string;
  clienteCreditoId?: string | null; 
  total: number;
  metodoPago: string;
  estatus: string;
  usuarioNombre: string;
  clienteCreditoNombre?: string;
  fechaVenta: string;
}


export interface DetalleVentaCreateDTO {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}


export interface VentaCreateDTO {
  tiendaId: string;
  usuarioId: string;
  clienteCreditoId?: string | null;
  total: number;
  metodoPago: string;
  detalles: DetalleVentaCreateDTO[];
}