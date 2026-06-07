import { api } from '../config/api';
import type {Venta, VentaCreateDTO } from '../types/ventas';


export const ventasService = {
    obtenerventas: async (tiendaId: string): Promise<Venta[]> => {
        const { data } = await api.get<Venta[]>(`/Ventas?tiendaId=${tiendaId}`);
        return data;
      },

    crearVenta: async (dto: VentaCreateDTO): Promise<Venta> => {



        const { data } = await api.post<Venta>('/Ventas', dto);
        return data;
      }








};

