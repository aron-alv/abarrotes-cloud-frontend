import { api } from '../config/api';
import type { Categoria, CategoriaCreateDTO, MovimientoKardex, KardexCreateDTO } from '../types/inventario';


export const inventarioService = {
  // ----- CATEGORÍAS -----
 obtenerCategorias: async (tiendaId: string): Promise<Categoria[]> => {
debugger;
    const { data } = await api.get<Categoria[]>(`/Categorias?tiendaId=${tiendaId}`);
    return data;
  },

  crearCategoria: async (dto: CategoriaCreateDTO): Promise<Categoria> => {
    const { data } = await api.post<Categoria>('/Categorias', dto);
    return data;
  },

 
 


  obtenerKardex: async (tiendaId: string): Promise<MovimientoKardex[]> => {
    const { data } = await api.get<MovimientoKardex[]>(`/Kardex?tiendaId=${tiendaId}`);
    return data;
  },

  crearMovimientoKardex: async (dto: KardexCreateDTO): Promise<MovimientoKardex> => {
    const { data } = await api.post<MovimientoKardex>('/Kardex', dto);
    return data;
  },

  eliminarcategoria: async (categoriaId: string, tiendaId: string, usuarioId: string): Promise<void> => {
    await api.delete(`/Categorias/${categoriaId}?tiendaId=${tiendaId}&usuarioId=${usuarioId}`);
  },

  actualizarCategoria: async (categoriaId: string, tiendaId: string, usuarioId: string, dto: CategoriaCreateDTO): Promise<Categoria> => {
    const { data } = await api.put<Categoria>(`/Categorias/${categoriaId}?tiendaId=${tiendaId}&usuarioId=${usuarioId}`, dto);
    return data;
  },

 
};