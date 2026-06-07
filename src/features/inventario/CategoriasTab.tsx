import { useState, useEffect } from 'react';
import { inventarioService } from '../../services/inventarioService';
import type { Categoria } from '../../types/inventario';
import { PlusCircle, Loader2, ClipboardList, Trash2, Edit } from 'lucide-react';

// 1. AÑADIMOS usuarioId A LAS PROPIEDADES
export const CategoriasTab = ({ tiendaId, usuarioId }: { tiendaId: string; usuarioId: string }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [buscando, setBuscando] = useState(true);

  // Memorias del formulario
  const [categoriaEditandoId, setCategoriaEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setBuscando(true);
      const data = await inventarioService.obtenerCategorias(tiendaId);
      setCategorias(data || []);
    } catch (error) {
      console.error("Error al traer categorías:", error);
    } finally {
      setBuscando(false);
    }
  };

  // ================= LÓGICA DEL FORMULARIO =================
  const cancelarEdicion = () => {
    setCategoriaEditandoId(null);
    setNombre('');
  };

  const handleEditar = (cat: Categoria) => {
    setCategoriaEditandoId(cat.id);
    setNombre(cat.nombre);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (!usuarioId) return alert("Faltan credenciales de seguridad del usuario.");

    try {
      setCargando(true);
      
      const dto = {
        tiendaId: tiendaId,
        nombre: nombre.trim()
      };

      if (categoriaEditandoId) {
        // ACTUALIZAR
        await inventarioService.actualizarCategoria(categoriaEditandoId, tiendaId, usuarioId, dto as any);
        alert("¡Categoría actualizada exitosamente!");
      } else {
        // CREAR NUEVO
        await inventarioService.crearCategoria(dto as any);
        alert("¡Categoría creada exitosamente!");
      }

      cancelarEdicion();
      await cargarCategorias();

    } catch (error: any) {
      alert("Error al guardar: " + (error.response?.data || "Verifica la consola."));
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  // ================= LÓGICA DE ELIMINACIÓN =================
  const handleEliminar = async (categoriaId: string, nombreCategoria: string) => {
    const confirmado = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la categoría "${nombreCategoria}"?`);
    if (!confirmado) return;

    if (!usuarioId) return alert("No se pudo identificar la sesión del usuario.");

    try {
      setCargando(true);
    
      await inventarioService.eliminarcategoria(categoriaId, tiendaId, usuarioId);
      await cargarCategorias();
      alert("¡Categoría eliminada correctamente!");
    } catch (error: any) {
       alert("Error al eliminar: " + (error.response?.data || "Verifica la consola."));
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* ================= COLUMNA IZQUIERDA: FORMULARIO ================= */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
        
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {categoriaEditandoId ? <Edit size={20} className="text-orange-500" /> : <PlusCircle size={20} className="text-blue-600" />}
            {categoriaEditandoId ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          
          {categoriaEditandoId && (
            <button onClick={cancelarEdicion} type="button" className="text-sm text-slate-500 hover:text-slate-700 underline">
              Cancelar
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-6">Agrega o modifica clasificaciones para tus productos.</p>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="block w-full sm:text-sm border-slate-300 rounded-xl py-2.5 px-4 border focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Ej. Bebidas, Botanas, Lácteos"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-colors ${
              categoriaEditandoId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {cargando ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : categoriaEditandoId ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </button>
        </form>
      </div>

      {/* ================= COLUMNA DERECHA: TABLA ================= */}
      <div className="lg:col-span-2">
        <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {buscando ? (
                <tr>
                  {/* Cambiamos el colSpan a 2 porque ahora hay 2 columnas */}
                  <td colSpan={2} className="px-6 py-10 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                    Buscando categorías en el servidor...
                  </td>
                </tr>
              ) : categorias.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center text-slate-400">
                    <ClipboardList className="mx-auto mb-2 text-slate-300" size={32} />
                    No hay categorías registradas en esta tienda aún.
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      {cat.nombre}
                    </td>
                    
                    {/* CELDA DE ACCIONES */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <button
                        onClick={() => handleEditar(cat)}
                        disabled={cargando}
                        className="p-2 text-orange-500 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Editar categoría"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleEliminar(cat.id, cat.nombre)}
                        disabled={cargando}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar categoría"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};