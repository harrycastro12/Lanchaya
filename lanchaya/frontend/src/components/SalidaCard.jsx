import { useAuth } from '../context/AuthContext.jsx';

const fmt = (iso) =>
  new Date(iso).toLocaleString('es-PE', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

// Semáforo de cupos: verde > 20, amarillo 6-20, rojo <= 5
const nivelCupos = (c) => (c > 20 ? 'verde' : c > 5 ? 'amarillo' : 'rojo');

export default function SalidaCard({ salida: s, onEditar, onEliminar }) {
  const { usuario } = useAuth();
  return (
    <article className="card">
      <div className="card-top">
        <h2>{s.destino}</h2>
        <span className={`badge ${s.tipo}`}>{s.tipo}</span>
      </div>
      <p className="empresa">{s.empresa}{s.embarcacion && ` · ${s.embarcacion}`}</p>
      <p>📍 {s.puerto}</p>
      <p>🕒 {fmt(s.fechaHora)} · {s.duracionHoras} h de viaje</p>
      <div className="card-bottom">
        <strong className="precio">S/ {s.precio}</strong>
        <span className={`cupos ${nivelCupos(s.cupos)}`}>{s.cupos} cupos</span>
      </div>
      {usuario && (
        <div className="acciones">
          <button className="btn" onClick={() => onEditar(s)}>Editar</button>
          <button className="btn danger" onClick={() => onEliminar(s)}>Eliminar</button>
        </div>
      )}
    </article>
  );
}
