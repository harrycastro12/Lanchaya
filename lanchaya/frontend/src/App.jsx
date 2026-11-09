import { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Filtros from './components/Filtros.jsx';
import SalidaCard from './components/SalidaCard.jsx';
import SalidaForm from './components/SalidaForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import { useAuth } from './context/AuthContext.jsx';
import * as api from './services/api.js';

export default function App() {
  const { usuario } = useAuth();
  const [verLogin, setVerLogin] = useState(false);
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [filtros, setFiltros] = useState({ destino: '', fecha: '', tipo: '' });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null); // null = cerrado, {} = nueva, objeto = editar

  // Si la sesión termina (logout o token vencido), se cierra cualquier formulario de edición abierto.
  useEffect(() => { if (!usuario) setForm(null); }, [usuario]);

  const cargarDestinos = () => api.getDestinos().then(setDestinos).catch(() => {});

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try { setSalidas(await api.getSalidas(filtros)); }
    catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }, [filtros]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { cargarDestinos(); }, []);

  const guardar = async (datos) => {
    if (form?.id) await api.actualizarSalida(form.id, datos);
    else await api.crearSalida(datos);
    setForm(null);
    cargar();
    cargarDestinos();
  };

  const eliminar = async (s) => {
    if (!window.confirm(`¿Eliminar la salida a ${s.destino} (${s.empresa})?`)) return;
    try { await api.eliminarSalida(s.id); cargar(); cargarDestinos(); }
    catch (e) { alert(e.message); }
  };

  return (
    <>
      <Navbar onNueva={() => setForm({})} onLogin={() => setVerLogin(true)} />
      <main>
        <Filtros filtros={filtros} setFiltros={setFiltros} destinos={destinos} />
        {cargando && <p className="estado">Cargando salidas…</p>}
        {error && <p className="estado error">⚠️ {error} <button className="btn" onClick={cargar}>Reintentar</button></p>}
        {!cargando && !error && salidas.length === 0 && <p className="estado">No hay salidas con esos filtros.</p>}
        <div className="grid">
          {!error && salidas.map((s) => (
            <SalidaCard key={s.id} salida={s} onEditar={setForm} onEliminar={eliminar} />
          ))}
        </div>
      </main>
      {verLogin && !usuario && <LoginForm onCerrar={() => setVerLogin(false)} />}
      {form && usuario && <SalidaForm inicial={form.id ? form : null} onGuardar={guardar} onCancelar={() => setForm(null)} />}
    </>
  );
}
