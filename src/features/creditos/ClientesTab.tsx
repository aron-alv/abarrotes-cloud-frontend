import { useState, useEffect } from 'react';
import { creditosService } from '../../services/creditosService';
import { Users, Loader2, DollarSign, Phone, User,Trash2} from 'lucide-react';
import type { ClienteCredito } from '../../types/creditos';

export const ClientesCreditoPantalla = ({ tiendaId, usuarioId }: { tiendaId: string; usuarioId: string }) => {
  const [clientes, setClientes] = useState<ClienteCredito[]>([]);
  const [cargando, setCargando] = useState(false);

  // Estados del formulario
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [limiteCredito, setLimiteCredito] = useState('');

  const cargarClientes = async () => {
    try {
      const data = await creditosService.obtenerClientesPorTienda(tiendaId);
      setClientes(data || []);
    } catch (error) {
      console.error("Error al cargar clientes", error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCargando(true);
      
      const nuevoCliente = {
        tiendaId,
        nombreCompleto: nombreCompleto.trim(),
        telefono: telefono.trim(),
        limiteCredito: parseFloat(limiteCredito),
        saldoActual: 0 
      };

      await creditosService.crearClienteCredito(nuevoCliente);

      // Limpiamos el formulario
      setNombreCompleto('');
      setTelefono('');
      setLimiteCredito('');
      
      await cargarClientes();
      alert('¡Cliente registrado con éxito!');
      
    } catch (error: any) {
      alert("Error al registrar cliente: " + (error.response?.data || "Verifica tu backend"));
      console.error("Error al registrar cliente", error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (clienteId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.")) return;
    
    if (!usuarioId) return alert("No se pudo identificar la sesión del usuario.");

 try {
      setCargando(true);
      await creditosService.eliminarClienteCredito({ clienteId, tiendaId, usuarioId });
      await cargarClientes();
      alert("¡Cliente eliminado correctamente!");
      
    } catch (error: any) {
      alert("Error al eliminar cliente: " + (error.response?.data || "Verifica tu backend"));
      console.error("Error al eliminar cliente", error);
    } finally {
      setCargando(false);
    }



  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit xl:col-span-1">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Nuevo Cliente de Crédito
        </h3>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-slate-400" />
              </div>
              <input type="text" required value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}
                className="w-full pl-10 border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="Ej. Juan Pérez" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-slate-400" />
              </div>
              <input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)}
                className="w-full pl-10 border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="10 dígitos" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Límite de Crédito ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-slate-400" />
              </div>
              <input type="number" min="0" step="0.01" required value={limiteCredito} onChange={(e) => setLimiteCredito(e.target.value)}
                className="w-full pl-10 border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="Ej. 1500.00" />
            </div>
          </div>

          <button type="submit" disabled={cargando}
            className="w-full flex justify-center mt-6 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {cargando ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Registrar Cliente'}
          </button>
        </form>
      </div>

    
      <div className="xl:col-span-2">
        {/* COLUMNA DERECHA: TABLA DE CLIENTES */}
        <div className="xl:col-span-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Todos los Clientes</h2>
          
          {clientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <Users size={48} className="text-slate-300 mb-4" />
              <p>Aún no hay clientes con crédito en esta tienda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50/50 text-sm text-slate-500">
                    <th className="p-4 font-semibold rounded-tl-xl">Nombre del Cliente</th>
                    <th className="p-4 font-semibold">Teléfono</th>
                    <th className="p-4 font-semibold">Límite de Crédito</th>
                    <th className="p-4 font-semibold text-right rounded-tr-xl">Deuda Actual</th>
                    <th className= "p-4 font-semibold text-right rounded-tr-xl">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">
                        {cliente.nombreCompleto}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-sm">
                        {cliente.telefono}
                      </td>
                      <td className="p-4 text-slate-600">
                        ${cliente.limiteCredito.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-bold px-3 py-1 rounded-full text-sm ${cliente.saldoActual > 0 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                          ${cliente.saldoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        
                        <button onClick={() => handleEliminar(cliente.id)}
                         className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50" title="Eliminar cliente">
                          <Trash2 size={20} />
                        </button>
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};