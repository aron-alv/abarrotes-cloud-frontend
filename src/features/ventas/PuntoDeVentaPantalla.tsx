import { useState, useEffect } from 'react';
import { creditosService } from '../../services/creditosService';
import { ventasService } from '../../services/ventasService';
import{productosTabService} from '../../services/productosTabService';
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Loader2 } from 'lucide-react';

// carrito
interface ItemCarrito {
  ventaId?: string;
  productoId: string;
  nombre: string;
  precioventa: number;
  cantidad: number | string; 
  subtotal: number;
  tipoUnidad: string; 
}

export const PuntoDeVentaPantalla = ({ tiendaId, usuarioId }: { tiendaId: string, usuarioId: string }) => {

  const [productos, setProductos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    productosTabService.obtenerProductos(tiendaId).then(setProductos);
    creditosService.obtenerClientesPorTienda(tiendaId).then(setClientes);
  }, [tiendaId]);

  
  const agregarAlCarrito = (producto: any) => {
    const existe = carrito.find(item => item.productoId === producto.id);
    
    const unidadDelProducto = producto.tipoUnidad || producto.tipounidad || 'Pieza';
    
    if (existe) {
      
      const nuevoCarrito = carrito.map(item => {
        if (item.productoId === producto.id) {
          const nuevaCantidad = Number(item.cantidad) + 1;
          return { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precioventa };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, {
        productoId: producto.id,
        nombre: producto.nombre,
        precioventa: producto.precioventa,
        cantidad: 1, 
        subtotal: producto.precioventa,
        tipoUnidad: unidadDelProducto 
      }]);
    }
  };


  const actualizarCantidad = (productoId: string, valorEscrito: string) => {
    setCarrito(carrito.map(item => {
      if (item.productoId === productoId) {
        
         if (valorEscrito === '') {
          return { ...item, cantidad: '', subtotal: 0 };
        }

        let nuevaCantidad = 0;

       
        if (item.tipoUnidad.toLowerCase() === 'pieza') {
         
          nuevaCantidad = parseInt(valorEscrito) || 0;
        } else {
          // Si es Kg, Litro o Granel, permitimos decimales
          nuevaCantidad = parseFloat(valorEscrito) || 0;
        }

        // Evitamos numeros negativos
        if (nuevaCantidad < 0) nuevaCantidad = 0;

        return {
          ...item,
          cantidad: nuevaCantidad,
          subtotal: nuevaCantidad * item.precioventa
        };
      }
      return item;
    }));
  };

  const quitarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter(item => item.productoId !== productoId));
  };

  const totalVenta = carrito.reduce((suma, item) => suma + item.subtotal, 0);

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  
  const handleCobrar = async () => {
    const hayProductosEnCero = carrito.some(item => Number(item.cantidad) <= 0);
    if (hayProductosEnCero) return alert("Hay productos en el carrito con cantidad 0. Ajusta la cantidad o elimínalos del ticket.");
    
    if (carrito.length === 0) return alert("El carrito está vacío.");
    if (metodoPago === 'Crédito' && !clienteSeleccionado) return alert("Selecciona un cliente para dar crédito.");

    try {
      setCargando(true);
      
      const cajaDeDatos = {
        tiendaId,
        usuarioId,
        clienteCreditoId: metodoPago === 'Crédito' ? clienteSeleccionado : null,
        total: totalVenta,
        metodoPago,
        detalles: carrito.map(item => ({
          productoId: item.productoId,
          
          cantidad: Number(item.cantidad),
          precioUnitario: item.precioventa,
          subtotal: item.subtotal
        }))
      };

      await ventasService.crearVenta(cajaDeDatos);

      setCarrito([]);
      setMetodoPago('Efectivo');
      setClienteSeleccionado('');
      setBusqueda('');
      alert("¡Venta registrada con éxito!");

    } catch (error: any) {
      alert("Error al cobrar: " + (error.response?.data || "Verifica C#"));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      
      {/* LADO IZQUIERDO: PRODUCTOS */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {productosFiltrados.map(prod => (
            <button 
              key={prod.id} 
              onClick={() => agregarAlCarrito(prod)}
              className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all active:scale-95 text-center"
            >
              <span className="font-bold text-slate-700 mb-2">{prod.nombre}</span>
              <span className="text-blue-600 font-black">${prod.precioventa}</span>
              {/* Le agregamos una pista visual de cómo se vende en el catálogo */}
              <span className="text-xs text-slate-400 uppercase mt-1">{prod.tipoUnidad || prod.tipounidad || 'Pieza'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* LADO DERECHO: EL TICKET / CARRITO */}
      <div className="bg-slate-800 rounded-2xl shadow-lg flex flex-col text-white overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingCart size={20} /> Mi Ticket
          </h2>
          <span className="bg-blue-500 text-xs px-2 py-1 rounded-full font-bold">{carrito.length} items</span>
        </div>

        {/* Lista del Carrito */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {carrito.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">Busca productos y haz clic para agregarlos.</p>
          ) : (
            carrito.map(item => (
              <div key={item.productoId} className="flex flex-col bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                <div className="flex justify-between items-start mb-2">
                  <strong className="block text-sm leading-tight pr-2">{item.nombre}</strong>
                  <button onClick={() => quitarDelCarrito(item.productoId)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center">
                  
                  {/* 3. NUEVO: Input dinámico para la cantidad */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="0" 
                      step={item.tipoUnidad.toLowerCase() === 'pieza' ? "1" : "0.01"}
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item.productoId, e.target.value)}
                      className="w-20 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-sm text-center text-white focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-slate-400">
                      {item.tipoUnidad} x ${item.precioventa}
                    </span>
                  </div>

                  <span className="font-bold text-green-400">${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Zona de Pago */}
        <div className="bg-slate-900 p-6 space-y-4 rounded-t-3xl border-t border-slate-700 mt-auto">
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMetodoPago('Efectivo')}
              className={`py-2 rounded-xl border flex items-center justify-center gap-2 font-medium ${metodoPago === 'Efectivo' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-slate-600 text-slate-400'}`}>
              <Banknote size={18} /> Efectivo
            </button>
            <button onClick={() => setMetodoPago('Crédito')}
              className={`py-2 rounded-xl border flex items-center justify-center gap-2 font-medium ${metodoPago === 'Crédito' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-600 text-slate-400'}`}>
              <CreditCard size={18} /> Crédito
            </button>
          </div>

          {metodoPago === 'Crédito' && (
            <select value={clienteSeleccionado} onChange={e => setClienteSeleccionado(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar Cliente...</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombreCompleto}</option>)}
            </select>
          )}

          <div className="flex justify-between items-end mb-2 pt-2 border-t border-slate-700">
            <span className="text-slate-400 uppercase tracking-wider text-sm">Total a cobrar</span>
            <span className="text-4xl font-black text-green-400">${totalVenta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
          </div>

          <button onClick={handleCobrar} disabled={carrito.length === 0 || cargando}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-xl py-4 rounded-xl transition-colors flex justify-center items-center">
            {cargando ? <Loader2 className="animate-spin" /> : 'Cobrar Ahora'}
          </button>
        </div>
      </div>

    </div>
  );
};