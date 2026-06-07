import { useState, useEffect } from 'react';
import { reporteService } from '../../services/reporteService';
import type { ReporteVenta, DetalleReporteVenta } from '../../types/reportes';
import { TrendingUp, Calendar, Loader2 } from 'lucide-react';

export const ReportesPantalla = ({ tiendaId }: { tiendaId: string, usuarioId: string }) => {

  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).toISOString().split('T')[0];

 
  const [fechaInicio, setFechaInicio] = useState(primerDiaMes);
  const [fechaFin, setFechaFin] = useState(ultimoDiaMes);

 
  const [resumen, setResumen] = useState<ReporteVenta | null>(null);
  const [detalles, setDetalles] = useState<DetalleReporteVenta[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      
      
      const [dataResumen, dataDetalles] = await Promise.all([
        reporteService.obtenerResumenVentas(tiendaId, fechaInicio, fechaFin),
        reporteService.obtenerDetalleReporteVentas(tiendaId, fechaInicio, fechaFin)
      ]);

      setResumen(dataResumen);
      setDetalles(dataDetalles || []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      alert("Hubo un problema al cargar los reportes. Revisa tu conexión o el backend.");
    } finally {
      setCargando(false);
    }
  };

  
  useEffect(() => {
    if (tiendaId) cargarDatos();
  }, [tiendaId]);

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      
      {/* 1. BARRA DE FILTROS SUPERIOR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-end sm:items-center gap-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg mr-auto">
          <Calendar className="text-blue-600" />
          Filtro de Fechas
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={e => setFechaInicio(e.target.value)}
            className="border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500 w-full sm:w-auto"
          />
          <span className="text-slate-400">al</span>
          <input 
            type="date" 
            value={fechaFin} 
            onChange={e => setFechaFin(e.target.value)}
            className="border-slate-300 rounded-xl py-2 px-3 border focus:ring-blue-500 w-full sm:w-auto"
          />
        </div>

        <button 
          onClick={cargarDatos} 
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl flex items-center justify-center transition-colors w-full sm:w-auto disabled:opacity-50"
        >
          {cargando ? <Loader2 className="animate-spin" size={20} /> : 'Generar Reporte'}
        </button>
      </div>

      {/* 2. TARJETAS DE RESUMEN (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Ingresos Totales</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ${resumen?.totalIngresos?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0.00'}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl"><TrendingUp className="text-blue-600" size={24} /></div>
          </div>
        </div>

        

      
       
       

      </div>

      {/* 3. TABLA DE DETALLES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Historial de Ventas del Periodo</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 bg-white text-sm text-slate-500">
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Cajero</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold text-center">Método</th>
                <th className="p-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {detalles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No se encontraron ventas en este rango de fechas.
                  </td>
                </tr>
              ) : (
                detalles.map((venta) => (
                  <tr key={venta.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600 text-sm">
                      {new Date(venta.fecha).toLocaleString('es-MX')}
                    </td>
                    <td className="p-4 text-slate-800 font-medium">
                      {venta.usuarioNombre}
                    </td>
                    <td className="p-4 text-slate-600">
                      {venta.clienteCreditoNombre}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        venta.metodoPago.toLowerCase() === 'efectivo' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {venta.metodoPago}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800">
                      ${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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