import { useState, useEffect } from 'react';
import { creditosService } from '../../services/creditosService';
import { Users, Loader2, DollarSign, Receipt, ChevronRight } from 'lucide-react';
import type { ClienteCredito, AbonoCredito } from '../../types/creditos';

export const ClienteAbonosCreditopantalla = ({ tiendaId, usuarioId }: { tiendaId: string, usuarioId: string }) => {

  const [clientes, setClientes] = useState<ClienteCredito[]>([]);
  const [abonos, setAbonos] = useState<AbonoCredito[]>([]);
  
  
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteCredito | null>(null);
  const [montoAbono, setMontoAbono] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    try {
    
      const [listaClientes, listaAbonos] = await Promise.all([
        creditosService.obtenerClientesPorTienda(tiendaId),
        creditosService.obtenerAbonosPorTienda(tiendaId)
      ]);
      setClientes(listaClientes || []);
      setAbonos(listaAbonos || []);

   
      if (clienteSeleccionado) {
        const clienteActualizado = listaClientes?.find(c => c.id === clienteSeleccionado.id);
        if (clienteActualizado) setClienteSeleccionado(clienteActualizado);
      }
    } catch (error) {
      console.error("Error al cargar la información", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [tiendaId]);

  const handleRegistrarAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado || !usuarioId) return alert("Faltan datos de sesión o seleccionar un cliente.");
    
    if (parseFloat(montoAbono) <= 0) return alert("El monto debe ser mayor a cero.");

    try {
      setCargando(true);
      
      const cajaDeAbono = {
        tiendaId,
        clienteId: clienteSeleccionado.id,
        usuarioId,
        montoAbonado: parseFloat(montoAbono),
        clienteNombre: clienteSeleccionado.nombreCompleto,
        
      };

      await creditosService.crearAbonoCredito(cajaDeAbono);

      setMontoAbono('');
      await cargarDatos(); 
      alert(`¡Abono de $${montoAbono} registrado a ${clienteSeleccionado.nombreCompleto}!`);
      
    } catch (error: any) {
      alert("Error al guardar el abono: " + (error.response?.data || "Verifica C#"));
    } finally {
      setCargando(false);
    }
  };

  
  const abonosDelCliente = abonos.filter(a => a.clienteId === clienteSeleccionado?.id);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
      
      {/* COLUMNA IZQUIERDA: Lista de Clientes */}
      <div className="bg-white p-0 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] xl:col-span-1 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Seleccionar Cliente
          </h3>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {clientes.map(cliente => (
            <button 
              key={cliente.id}
              onClick={() => setClienteSeleccionado(cliente)}
              className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-colors ${clienteSeleccionado?.id === cliente.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div>
                <strong className="block text-slate-800">{cliente.nombreCompleto}</strong>
                <span className={`text-sm font-medium ${cliente.saldoActual > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  Debe: ${cliente.saldoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <ChevronRight size={18} className={clienteSeleccionado?.id === cliente.id ? 'text-blue-600' : 'text-slate-300'} />
            </button>
          ))}
          {clientes.length === 0 && (
            <p className="text-center text-slate-400 mt-10 text-sm">No hay clientes registrados.</p>
          )}
        </div>
      </div>

      {/* COLUMNA DERECHA: DETALLE (Abonos y Formulario) */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        
        {!clienteSeleccionado ? (
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-slate-400 p-10">
            <Receipt size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium">Selecciona un cliente de la lista</p>
            <p className="text-sm">Podrás registrar pagos y ver su historial</p>
          </div>
        ) : (
          <>
            {/* CAJA SUPERIOR: Formulario de Abono Rápido */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{clienteSeleccionado.nombreCompleto}</h2>
                <p className="text-slate-500">Saldo pendiente: <strong className="text-red-500">${clienteSeleccionado.saldoActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></p>
              </div>
              
              <form onSubmit={handleRegistrarAbono} className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-slate-400" />
                  </div>
                  <input type="number" min="1" step="0.5" required value={montoAbono} onChange={(e) => setMontoAbono(e.target.value)}
                    className="w-full pl-9 border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500" placeholder="0.00" />
                </div>
                <button type="submit" disabled={cargando || clienteSeleccionado.saldoActual <= 0}
                  className="whitespace-nowrap flex items-center justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {cargando ? <Loader2 className="animate-spin" size={18} /> : 'Abonar'}
                </button>
              </form>
            </div>

            {/* CAJA INFERIOR: Historial de Abonos */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Historial de Pagos</h3>
              
              {abonosDelCliente.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Este cliente no ha realizado ningún abono aún.</p>
              ) : (
                <ul className="space-y-3">
                  {abonosDelCliente.map(abono => (
                    <li key={abono.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                      <div>
                        <strong className="text-slate-800 block">Abono en Efectivo</strong>
                        <span className="text-xs text-slate-500">Recibido por: {abono.usuarioNombre || 'Cajero'}</span>
                        <span className="text-xs text-slate-400 block">{new Date(abono.fechaabono).toLocaleString()}</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        +${abono.montoAbonado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};