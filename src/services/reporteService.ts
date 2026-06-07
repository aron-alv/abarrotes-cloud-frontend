import { api } from '../config/api';
import type { ReporteVenta, DetalleReporteVenta } from '../types/reportes';

export const reporteService = {

  obtenerResumenVentas: async (tiendaId: string, fechaInicio?: string, fechaFin?: string): Promise<ReporteVenta> => {
  
    let url = `/Reportes/resumen?tiendaId=${tiendaId}`;
    if (fechaInicio && fechaFin) {
      url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }
    const { data } = await api.get<ReporteVenta>(url);
    return data;
  },

  
  obtenerDetalleReporteVentas: async (tiendaId: string, fechaInicio: string, fechaFin: string): Promise<DetalleReporteVenta[]> => {
    const { data } = await api.get<DetalleReporteVenta[]>(`/Reportes/detalles?tiendaId=${tiendaId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return data;
  }
};