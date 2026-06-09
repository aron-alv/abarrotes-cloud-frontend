import { api } from '../config/api';
import type { AbonoCredito, AbonoCreditoCreateDTO, ClienteCredito, ClienteCreditoCreateDTO, EliminarClienteCreditoDTO } from '../types/creditos';

export const creditosService = {
    crearClienteCredito: async (dto: ClienteCreditoCreateDTO): Promise<ClienteCredito> => {

      const { data } = await api.post<ClienteCredito>('/ClienteCredito', dto);
      return data;
    },

    eliminarClienteCredito: async (dto: EliminarClienteCreditoDTO): Promise<void> => {
      await api.delete(`/ClienteCredito/${dto.clienteId}?tiendaId=${dto.tiendaId}&usuarioId=${dto.usuarioId}`);
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