import { useState } from 'react';
import { supabase } from '../config/supabase';
import { 
  Menu, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  LogOut, 
  Store,
  DollarSign,
  PackageOpen
} from 'lucide-react';


import { KardexPantalla } from '../features/kardex/KardexPantalla';
import { ClientesCreditoPantalla } from '../features/creditos/ClientesTab';
import { ClienteAbonosCreditopantalla } from '../features/creditos/ClienteAbonarTab';
import { PuntoDeVentaPantalla } from '../features/ventas/PuntoDeVentaPantalla';
import { ReportesPantalla } from '../features/reportes/ReportesPantalla';
import { ProductosTab } from '../features/inventario/ProductosTab';
import { CategoriasTab } from '../features/inventario/CategoriasTab';


export const DashboardLayout = ({ session, tiendaId, usuarioId }: { session: any, tiendaId: string, usuarioId: string }) => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [vistaActual, setVistaActual] = useState('pos');

  const menuItems = [
    { id: 'pos', nombre: 'Punto de Venta', icono: ShoppingCart },
    { id: 'inventario', nombre: 'Inventario', icono: Package },
    { id: 'categorias', nombre: 'Categorías', icono: PackageOpen },
    { id: 'clientes', nombre: 'Clientes', icono: Users },
    { id: 'kardex', nombre: 'Kardex', icono: FileText },
    {id: 'abonar', nombre: 'Abonar a Crédito', icono: DollarSign},
    { id: 'reportes', nombre: 'Reportes', icono: FileText }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* ================= BARRA LATERAL ================= */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col relative`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Store className="text-blue-500" />
              <span>AbarrotesCloud</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors mx-auto"
          >
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
          {menuItems.map((item) => {
            const Icono = item.icono;
            const activo = vistaActual === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setVistaActual(item.id)}
                className={`relative flex items-center p-3 rounded-xl transition-all group ${
                  activo ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <Icono size={22} className={!isCollapsed ? 'mr-3' : ''} />
                {!isCollapsed && <span className="font-medium">{item.nombre}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-slate-700">
                    {item.nombre}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          {!isCollapsed && (
            <div className="mb-4 text-xs truncate">
              <p className="text-slate-500">Sesión iniciada como:</p>
              <p className="font-semibold text-slate-300">{session?.user?.email}</p>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className={`flex items-center text-red-400 hover:text-red-300 hover:bg-slate-800 w-full p-3 rounded-xl transition-colors group ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <LogOut size={22} className={!isCollapsed ? 'mr-3' : ''} />
            {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-red-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Cerrar Sesión
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ================= ÁREA DE CONTENIDO ================= */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-slate-200 z-10">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {menuItems.find(i => i.id === vistaActual)?.nombre}
          </h1>
        </header>

       <div className="flex-1 overflow-auto p-8 bg-slate-50">
  {(() => {
    switch (vistaActual) {
      case 'pos':
        return (
          <PuntoDeVentaPantalla
            tiendaId={tiendaId}
            usuarioId={usuarioId}
          />
        );
         case 'categorias':
        return (
          <CategoriasTab
          
            tiendaId={tiendaId}
            usuarioId={usuarioId}
            
            
          />
        );

      case 'inventario':
        return (
          <ProductosTab
          
            tiendaId={tiendaId}
            usuarioId={usuarioId}
            
          />
        );

      case 'clientes':
        return (
          <ClientesCreditoPantalla
            tiendaId={tiendaId}
          />
        );

      case 'kardex':
        return (
          <KardexPantalla
            tiendaId={tiendaId}
            usuarioId={usuarioId}
          />
        );

      case 'abonar':
        return (
          <ClienteAbonosCreditopantalla
            tiendaId={tiendaId}
            usuarioId={usuarioId}
          />
        );

        case 'reportes':
          return (
            <ReportesPantalla
              tiendaId={tiendaId}
              usuarioId={usuarioId}
            />
          );

      default:
        return <div>Vista no encontrada: {vistaActual}</div>;
    }
  })()}
</div>
      </main>

    </div>
  );
};