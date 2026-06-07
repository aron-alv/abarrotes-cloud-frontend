import { useState } from 'react';
import { Package, Tags } from 'lucide-react';
import { CategoriasTab } from './CategoriasTab';
import { ProductosTab } from './ProductosTab';
export const Inventario = ({ tiendaId, usuarioId }: { tiendaId: string; usuarioId: string }) => {
  const [tabActivo, setTabActivo] = useState<'productos' | 'categorias'>('productos');

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Selector de Pestañas (Tabs) */}
      <div className="flex space-x-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200 w-fit">
        <button
          onClick={() => setTabActivo('productos')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            tabActivo === 'productos' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Package size={20} className="mr-2" />
          Productos
        </button>
        <button
          onClick={() => setTabActivo('categorias')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            tabActivo === 'categorias' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Tags size={20} className="mr-2" />
          Categorías
        </button>
      </div>

      {/* Contenido Dinámico */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
     {tabActivo === 'productos' && (
          <ProductosTab tiendaId={tiendaId} usuarioId={usuarioId} />
        )}

        {tabActivo === 'categorias' && (
       
          <CategoriasTab tiendaId={tiendaId} usuarioId={usuarioId} />
        )}
      </div>

    </div>
  );
};