import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({ onNueva, onLogin }) {
  const { usuario, logout } = useAuth();
  return (
    <header className="navbar">
      <h1>🚤 LanchaYa <span>Iquitos</span></h1>
      <div className="navbar-acciones">
        {usuario ? (
          <>
            <span className="usuario">👤 {usuario.usuario}</span>
            <button className="btn primary" onClick={onNueva}>+ Nueva salida</button>
            <button className="btn" onClick={logout}>Salir</button>
          </>
        ) : (
          <button className="btn primary" onClick={onLogin}>Iniciar sesión</button>
        )}
      </div>
    </header>
  );
}
