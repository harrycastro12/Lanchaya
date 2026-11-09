import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

// Modal de inicio de sesión (reutiliza los estilos de overlay/modal).
export default function LoginForm({ onCerrar }) {
  const { login } = useAuth();
  const [f, setF] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const enviar = async (ev) => {
    ev.preventDefault();
    if (!f.usuario.trim() || !f.password) return setError('Ingresa usuario y contraseña');
    setEnviando(true);
    setError('');
    try {
      await login(f.usuario, f.password);
      onCerrar();
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="overlay" onClick={onCerrar}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={enviar} noValidate>
        <h2>Iniciar sesión</h2>
        {error && <ul className="errores"><li>{error}</li></ul>}
        <label>Usuario<input name="usuario" autoComplete="username" autoFocus value={f.usuario} onChange={cambiar} /></label>
        <label>Contraseña<input type="password" name="password" autoComplete="current-password" value={f.password} onChange={cambiar} /></label>
        <div className="acciones">
          <button type="button" className="btn" onClick={onCerrar}>Cancelar</button>
          <button className="btn primary" disabled={enviando}>{enviando ? 'Ingresando…' : 'Ingresar'}</button>
        </div>
      </form>
    </div>
  );
}
