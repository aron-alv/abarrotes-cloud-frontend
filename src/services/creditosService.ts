import { api } from '../config/api';
import type { AbonoCredito, AbonoCreditoCreateDTO, ClienteCredito, ClienteCreditoCreateDTO } from '../types/creditos';

export const creditosService = {
    crearClienteCredito: async (dto: ClienteCreditoCreateDTO): Promise<ClienteCredito> => {

      const { data } = await api.post<ClienteCredito>('/ClienteCredito', dto);
      return data;
    },

    obtenerClientesPorTienda: async (tiendaId: string): Promise<ClienteCredito[]> => {
    
      const { data } = await api.get<ClienteCredito[]>(`/ClienteCredito?tiendaId=${tiendaId}`);
      return data;
    },

    crearAbonoCredito: async (dto: AbonoCreditoCreateDTO): Promise<AbonoCredito> => {
        const { data } = await api.post<AbonoCredito>('/AbonosCreditos', dto);
        return data;
      },


    obtenerAbonosPorTienda: async (tiendaId: string): Promise<AbonoCredito[]> => {

      const { data } = await api.get<AbonoCredito[]>(`/AbonosCreditos?tiendaId=${tiendaId}`);
      return data;
    }





};