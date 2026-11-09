import { useState } from 'react';

const VACIO = { empresa: '', embarcacion: '', tipo: 'rapido', destino: '', puerto: '', fechaHora: '', duracionHoras: '', precio: '', cupos: '' };
const ahora = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

// Modal para crear/editar. `inicial` = null (crear) o la salida a editar.
export default function SalidaForm({ inicial, onGuardar, onCancelar }) {
  const [f, setF] = useState(inicial ? { ...inicial } : VACIO);
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setF({ ...f, [e.target.name]: e.target.value });

  // Validación en cliente (espejo de la del backend)
  const validar = () => {
    const e = [];
    ['empresa', 'destino', 'puerto', 'fechaHora'].forEach((c) => { if (!String(f[c]).trim()) e.push(`"${c}" es obligatorio`); });
    if (!(Number(f.precio) > 0)) e.push('El precio debe ser mayor a 0');
    if (f.cupos !== '' && Number(f.cupos) < 0) e.push('Los cupos no pueden ser negativos');
    if (f.duracionHoras !== '' && Number(f.duracionHoras) < 0) e.push('La duración no puede ser negativa');
    if (f.fechaHora && (!inicial || f.fechaHora !== inicial.fechaHora) && new Date(f.fechaHora) < new Date())
      e.push('La fecha y hora no pueden estar en el pasado');
    return e;
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (e.length) return;
    setEnviando(true);
    try {
      await onGuardar({
        ...f,
        precio: Number(f.precio),
        duracionHoras: f.duracionHoras === '' ? 0 : Number(f.duracionHoras),
        cupos: f.cupos === '' ? 0 : Number(f.cupos),
      });
    } catch (err) {
      setErrores([err.message]); // errores 400 del backend
      setEnviando(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancelar}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={enviar} noValidate>
        <h2>{inicial ? 'Editar salida' : 'Nueva salida'}</h2>
        {errores.length > 0 && <ul className="errores">{errores.map((m) => <li key={m}>{m}</li>)}</ul>}
        <label>Empresa *<input name="empresa" value={f.empresa} onChange={cambiar} /></label>
        <label>Embarcación<input name="embarcacion" value={f.embarcacion} onChange={cambiar} /></label>
        <label>Tipo *
          <select name="tipo" value={f.tipo} onChange={cambiar}>
            <option value="lancha">Lancha</option><option value="rapido">Rápido</option><option value="deslizador">Deslizador</option>
          </select>
        </label>
        <label>Destino *<input name="destino" value={f.destino} onChange={cambiar} /></label>
        <label>Puerto *<input name="puerto" value={f.puerto} onChange={cambiar} /></label>
        <label>Fecha y hora *<input type="datetime-local" name="fechaHora" min={inicial ? undefined : ahora()} value={f.fechaHora} onChange={cambiar} /></label>
        <div className="fila">
          <label>Duración (h)<input type="number" min="0" name="duracionHoras" value={f.duracionHoras} onChange={cambiar} /></label>
          <label>Precio (S/) *<input type="number" min="0" step="0.5" name="precio" value={f.precio} onChange={cambiar} /></label>
          <label>Cupos<input type="number" min="0" name="cupos" value={f.cupos} onChange={cambiar} /></label>
        </div>
        <div className="acciones">
          <button type="button" className="btn" onClick={onCancelar}>Cancelar</button>
          <button className="btn primary" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
