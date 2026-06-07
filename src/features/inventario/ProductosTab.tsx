import { useState, useEffect } from 'react';
import { inventarioService } from '../../services/inventarioService';
import type { Categoria } from '../../types/inventario';
import type { Producto } from '../../types/productosTab';
import { productosTabService } from '../../services/productosTabService';
import { PackagePlus, Loader2, PackageOpen,  CircleDollarSign, Scale,Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';

export const ProductosTab = ({ tiendaId, usuarioId }: { tiendaId: string; usuarioId: string }) => {


  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [buscando, setBuscando] = useState(true);

  // Estados del Formulario
  const [nombre, setNombre] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [precioventa, setPrecioventa] = useState('');
  const [preciocompra, setPreciocompra] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [tipoUnidad, setTipoUnidad] = useState('Pieza'); 
 
  const [productoEditandoId, setProductoEditandoId] = useState<string | null>(null);


  const handleEditar = (prod: any) => {
    setProductoEditandoId(prod.id);
    setCodigoBarras(prod.codigoBarras || '');
    setNombre(prod.nombre);
    setPrecioventa(prod.precioventa.toString());
    setPreciocompra(prod.preciocompra.toString());
    setTipoUnidad(prod.tipoUnidad || prod.tipounidad || 'Pieza');
    
   
    setCategoriaId(prod.categoriaId || prod.categoriaid || '');
  };

 
  const cancelarEdicion = () => {
    setProductoEditandoId(null);
    setCodigoBarras('');
    setNombre('');
    setPrecioventa('');
    setPreciocompra('');
    setTipoUnidad('Pieza');
    setCategoriaId('');
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setBuscando(true);
      const [prods, cats] = await Promise.all([
        productosTabService.obtenerProductos(tiendaId),
        inventarioService.obtenerCategorias(tiendaId)
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (error) {
      console.error("Error al traer datos:", error);
    } finally {
      setBuscando(false);
    }
  };





  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();



    try {
      setCargando(true);
      
      const dto = {
        tiendaId,
        categoriaId,
        codigoBarras,
        nombre,
        precioCompra: parseFloat(preciocompra),
        precioVenta: parseFloat(precioventa),
        tipoUnidad,
       
      };

      if (productoEditandoId) {
        console.log("Editando producto con ID:", productoEditandoId);
        // SI HAY UN ID, ACTUALIZAMOS
        await productosTabService.actualizarProducto(productoEditandoId, tiendaId, usuarioId, dto as any);
        alert("¡Producto actualizado exitosamente!");
      } else {
        // SI NO HAY ID, CREAMOS UNO NUEVO
       
        await productosTabService.crearProducto(dto as any);
        alert("¡Producto creado exitosamente!");
      }

      // Limpiamos y recargamos
      cancelarEdicion();
      await cargarDatos();

    } catch (error: any) {
      alert("Error al guardar el producto. Verifica la consola.");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (productoId: string, nombreProducto: string) => {
   
    const confirmado = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${nombreProducto}"?`);
    if (!confirmado) return; 

    if (!usuarioId) return alert("No se pudo identificar la sesión del usuario.");

    try {
      setCargando(true);
      
   
      await productosTabService.eliminarProducto(productoId, tiendaId, usuarioId);
      
    
      await cargarDatos();
      alert("¡Producto eliminado correctamente!");

    } catch (error: any) {
      alert("Error al eliminar: " + (error.response?.data || "Verifica la consola."));
      console.error(error);
    } finally {
      setCargando(false);
    }
  };



  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* ================= COLUMNA IZQUIERDA: FORMULARIO ================= */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit xl:col-span-1">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {productoEditandoId ? <Edit size={20} className="text-orange-500" /> : <PackagePlus size={20} className="text-blue-600" />}
            {productoEditandoId ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          
          {productoEditandoId && (
            <button onClick={cancelarEdicion} type="button" className="text-sm text-slate-500 hover:text-slate-700 underline">
              Cancelar
            </button>
          )}
        </div>

        <form onSubmit={handleGuardar} className="space-y-4">
         

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
            <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="Ej. Frijol Pinto 1kg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <CircleDollarSign size={16} /> Precio Venta
              </label>
              <input type="number" step="0.5" min="0" required value={precioventa} onChange={(e) => setPrecioventa(e.target.value)}
                className="w-full border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="$ 0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <CircleDollarSign size={16} /> Precio Compra
              </label>
              <input type="number" step="0.5" min="0" required value={preciocompra} onChange={(e) => setPreciocompra(e.target.value)}
                className="w-full border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="$ 0.00" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Scale size={16} /> Se vende por:
              </label>
              <select required value={tipoUnidad} onChange={(e) => setTipoUnidad(e.target.value)}
                className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-blue-500 bg-white"
              >
                <option value="Pieza">Pieza (Unidad)</option>
                <option value="Kg">Kilogramo (Kg)</option>
                <option value="Litro">Litro (L)</option>
                <option value="Granel">A Granel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select required value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-blue-500 bg-white"
            >
              <option value="">Selecciona una categoría...</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={cargando}
            className={`w-full flex justify-center mt-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-colors ${
              productoEditandoId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {cargando ? <Loader2 className="animate-spin mr-2" size={18} /> : productoEditandoId ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
        </form>
      </div>

      {/* ================= COLUMNA DERECHA: TABLA ================= */}
      <div className="xl:col-span-2">
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Stock / Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {buscando ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" size={24} />
                    Cargando catálogo...
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    <PackageOpen className="mx-auto mb-2 text-slate-300" size={32} />
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      {prod.codigoBarras ? prod.codigoBarras : <span className="text-slate-300 italic">S/C</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{prod.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">${prod.precioventa}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${prod.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {prod.stock}
                      </span>
                      <span className="text-xs text-slate-400 uppercase">{prod.tipoUnidad}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <button
                        onClick={() => handleEditar(prod)}
                        disabled={cargando}
                        className="p-2 text-orange-500 hover:bg-orange-50 hover:text-orange-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Editar producto"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleEliminar(prod.id, prod.nombre)}
                        disabled={cargando}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar producto"
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