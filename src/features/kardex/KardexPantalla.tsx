import { useState, useEffect } from 'react';
import { inventarioService } from '../../services/inventarioService';
import { ArrowDownToLine, ArrowUpFromLine, Loader2, FileText } from 'lucide-react';
import { productosTabService } from '../../services/productosTabService';


export const KardexPantalla = ({ tiendaId, usuarioId }: { tiendaId: string, usuarioId: string }) => {

 
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

 
  const [productoId, setProductoId] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('Entrada');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('Compra Proveedor');

  const cargarDatos = () => {
    productosTabService.obtenerProductos(tiendaId).then(setProductos);
    inventarioService.obtenerKardex(tiendaId).then(setMovimientos);
  };

  useEffect(() => {
    cargarDatos();
  }, []); 

 
  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault(); 
   
    if (!productoId) return alert("Selecciona un producto.");
    if (!usuarioId) return alert("No se pudo identificar la sesión del usuario.");

console.log("1. Entrando a handleGuardar");
   


    try {
      setCargando(true);
      
     
      const cajaDeDatos = {
        tiendaId: tiendaId,       
        productoId: productoId,  
        usuarioId: usuarioId,     
        tipoMovimiento: tipoMovimiento,
        cantidad: parseInt(cantidad), 
        motivo: motivo.trim()
      };

      await inventarioService.crearMovimientoKardex(cajaDeDatos);

     
      setCantidad('');
      setMotivo(tipoMovimiento === 'Entrada' ? 'Compra a proveedor' : 'Merma o daño');
      await cargarDatos();
      alert(`¡Movimiento guardado con éxito!`);
      
    } catch (error: any) {
      alert("Error al guardar: " + (error.response?.data || "Verifica tu backend"));
    } finally {
      setCargando(false);
    }
  };
  // ============================================================

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* COLUMNA IZQUIERDA: EL FORMULARIO */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit xl:col-span-1">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText size={20} className="text-blue-600" />
          Registrar Movimiento
        </h3>

        <form onSubmit={handleGuardar} className="space-y-4">
          
          {/* Botones de Entrada/Salida */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setTipoMovimiento('Entrada'); setMotivo('Compra a proveedor'); }}
                className={`flex justify-center py-2 px-4 rounded-xl border font-medium transition-colors ${tipoMovimiento === 'Entrada' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                <ArrowDownToLine size={16} className="mr-2 mt-0.5" /> Entrada
              </button>
              <button type="button" onClick={() => { setTipoMovimiento('Salida'); setMotivo('Merma o daño'); }}
                className={`flex justify-center py-2 px-4 rounded-xl border font-medium transition-colors ${tipoMovimiento === 'Salida' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                <ArrowUpFromLine size={16} className="mr-2 mt-0.5" /> Salida
              </button>
            </div>
          </div>

          {/* Selector de Producto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Producto</label>
            <select required value={productoId} onChange={(e) => setProductoId(e.target.value)}
              className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-blue-500 bg-white">
              <option value="">Selecciona un producto...</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          {/* Input de Cantidad */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
            <input type="number" min="1" required value={cantidad} onChange={(e) => setCantidad(e.target.value)}
              className="w-full border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="Ej. 50" />
          </div>

          {/* Input de Motivo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Justificación</label>
            <input type="text" required value={motivo} onChange={(e) => setMotivo(e.target.value)}
              className="w-full border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" />
          </div>

          <button type="submit" disabled={cargando}
            className="w-full flex justify-center mt-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {cargando ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Guardar en Base de Datos'}
          </button>
        </form>
      </div>

      {/* COLUMNA DERECHA: LA TABLA QUE YA TENÍAMOS */}
      <div className="xl:col-span-2">
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Historial de Movimientos</h2>
          <ul className="space-y-3">
            {movimientos.map((mov) => (
              <li key={mov.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                <div>
                  <strong className="text-lg text-slate-800 block">{mov.productoNombre}</strong>
                  <span className="text-xs text-slate-500">Motivo: {mov.motivo}</span>
                  <span className="text-xs text-slate-400 block">{new Date(mov.fechaRegistro).toLocaleString()}</span>
                  <span className="text-xs text-slate-500">Usuario: {mov.usuarioNombre}</span>
                </div>
                <div className="text-right">
                  <span className={`block text-lg font-bold ${mov.tipoMovimiento === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {mov.tipoMovimiento === 'Entrada' ? '+' : '-'}{mov.cantidad}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};