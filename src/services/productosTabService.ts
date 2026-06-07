import { api } from '../config/api';
import type { Producto, ProductoCreateDTO, ProductoUpdateDTO} from '../types/productosTab';

export const productosTabService = {
  

  obtenerProductos: async (tiendaId: string): Promise<Producto[]> => {

    const { data } = await api.get<Producto[]>(`/Productos?tiendaId=${tiendaId}`);
    return data;
  },

  crearProducto: async (dto: ProductoCreateDTO): Promise<Producto> => {
    const { data } = await api.post<Producto>('/Productos', dto);
    return data;
  },


  eliminarProducto: async (productoId: string, tiendaId: string, usuarioId: string): Promise<void> => {
    await api.delete(`/Productos/${productoId}?tiendaId=${tiendaId}&usuarioId=${usuarioId}`);
  },

actualizarProducto: async (productoId: string, tiendaId: string, usuarioId: string, dto: ProductoUpdateDTO): Promise<Producto> => {

    const { data } = await api.put<Producto>(`/Productos/${productoId}?tiendaId=${tiendaId}&usuarioId=${usuarioId}`, dto);
    return data;
  },
};