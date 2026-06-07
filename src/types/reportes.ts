export interface ReporteVenta {
totalIngresos: number;
CantidadVentas: number;
TotalEfectivo: number;
TotalCredito: number;
}


export interface DetalleReporteVenta {
id: string;
total: number;
metodoPago: string;
estatus: string;
fecha: string;
usuarioNombre: string;
clienteCreditoNombre?: string;
}