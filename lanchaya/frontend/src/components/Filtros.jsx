// Panel de filtros. `destinos` viene de /api/destinos.
export default function Filtros({ filtros, setFiltros, destinos }) {
  const cambiar = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
  return (
    <section className="filtros">
      <select name="destino" value={filtros.destino} onChange={cambiar} aria-label="Destino">
        <option value="">Todos los destinos</option>
        {destinos.map((d) => <option key={d}>{d}</option>)}
      </select>
      <input type="date" name="fecha" value={filtros.fecha} onChange={cambiar} aria-label="Fecha" />
      <select name="tipo" value={filtros.tipo} onChange={cambiar} aria-label="Tipo">
        <option value="">Todos los tipos</option>
        <option value="lancha">Lancha</option>
        <option value="rapido">Rápido</option>
        <option value="deslizador">Deslizador</option>
      </select>
      <button className="btn" onClick={() => setFiltros({ destino: '', fecha: '', tipo: '' })}>Limpiar</button>
    </section>
  );
}
