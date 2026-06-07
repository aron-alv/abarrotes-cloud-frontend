import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './config/supabase';
import { Login } from './features/auth/Login';
import { DashboardLayout } from './layouts/DashboardLayout';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');


  const [tiendaId, setTiendaId] = useState<string>('');
  const [usuarioIdReal, setUsuarioIdReal] = useState<string>('');
  useEffect(() => {
   
    supabase.auth.getSession().then(({ data: { session } }) => {
      validarAcceso(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      validarAcceso(session);
    });

    return () => subscription.unsubscribe();
  }, []);


const validarAcceso = async (sesionActual: Session | null) => {
    
    if (!sesionActual || !sesionActual.user.email) {
      setSession(null);
      setIsAllowed(false);
      setIsLoading(false);
      return;
    }

    const correoUsuario = sesionActual.user.email;

    
    const { data: invitado } = await supabase
      .from('listablanca')
      .select('email, tienda_id')
      .eq('email', correoUsuario)
      .maybeSingle();

  
    if (!invitado) {
      await supabase.auth.signOut();
      setSession(null);
      setIsAllowed(false);
      setErrorMsg('Acceso denegado. Comunícate con el administrador para registrar tu correo.');
      setIsLoading(false);
      return;
    }

  
    const { data: usuarioDB } = await supabase
      .from('usuarios')
      .select('id') 
      .eq('email', correoUsuario)
      .maybeSingle();


    
    if (!usuarioDB) {
      await supabase.auth.signOut();
      setSession(null);
      setIsAllowed(false);
      setErrorMsg('Tu correo está autorizado, pero falta crear tu perfil en la base de datos.');
      setIsLoading(false);
      return;
    }

  
    setSession(sesionActual);
    setTiendaId(invitado.tienda_id); 
    setUsuarioIdReal(usuarioDB.id); 
    setIsAllowed(true);
    setErrorMsg('');
    setIsLoading(false);
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  
  if (!session || !isAllowed) {
    return (
      <div className="relative">
        {}
        {errorMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl z-50 shadow-lg text-center font-medium animate-bounce">
            {errorMsg}
          </div>
        )}
        <Login />
      </div>
    );
  }


  return <DashboardLayout session={session} tiendaId={tiendaId} usuarioId={usuarioIdReal} />;
}

export default App;