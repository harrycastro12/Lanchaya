// Controlador de salidas fluviales: lectura/escritura en JSON + validaciones.
const fs = require('fs');
const path = require('path');

const DB = path.join(__dirname, '../data/salidas.json');
const TIPOS = ['lancha', 'rapido', 'deslizador'];

const leer = () => JSON.parse(fs.readFileSync(DB, 'utf8'));
const guardar = (data) => fs.writeFileSync(DB, JSON.stringify(data, null, 2));

// Devuelve un arreglo de errores (vacío si todo es válido).
// `esNueva` activa la regla "fecha no puede estar en el pasado".
function validar(b, esNueva) {
  const errores = [];
  for (const c of ['empresa', 'destino', 'puerto', 'fechaHora']) {
    if (typeof b[c] !== 'string' || !b[c].trim()) errores.push(`El campo "${c}" es obligatorio`);
  }
  if (typeof b.precio !== 'number' || !(b.precio > 0)) errores.push('"precio" debe ser un número mayor a 0');
  if (!TIPOS.includes(b.tipo)) errores.push(`"tipo" debe ser uno de: ${TIPOS.join(', ')}`);
  for (const c of ['duracionHoras', 'cupos']) {
    if (b[c] !== undefined && (typeof b[c] !== 'number' || b[c] < 0)) errores.push(`"${c}" debe ser un número >= 0`);
  }
  if (typeof b.fechaHora === 'string' && b.fechaHora.trim()) {
    const f = new Date(b.fechaHora);
    if (isNaN(f)) errores.push('"fechaHora" no es una fecha válida (ISO 8601)');
    else if (esNueva && f < new Date()) errores.push('"fechaHora" no puede estar en el pasado');
  }
  return errores;
}

// Deja solo los campos del modelo y limpia textos.
const limpiar = (b) => ({
  empresa: b.empresa?.trim(), embarcacion: b.embarcacion?.trim() || '', tipo: b.tipo,
  destino: b.destino?.trim(), puerto: b.puerto?.trim(), fechaHora: b.fechaHora,
  duracionHoras: b.duracionHoras ?? 0, precio: b.precio, cupos: b.cupos ?? 0,
});

exports.listar = (req, res) => {
  const { destino, fecha, tipo } = req.query;
  let r = leer();
  if (destino) r = r.filter((s) => s.destino.toLowerCase() === destino.toLowerCase());
  if (fecha) r = r.filter((s) => s.fechaHora.startsWith(fecha)); // fecha = YYYY-MM-DD
  if (tipo) r = r.filter((s) => s.tipo === tipo);
  r.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)); // más próxima primero
  res.json(r);
};

exports.detalle = (req, res) => {
  const s = leer().find((x) => x.id === Number(req.params.id));
  if (!s) return res.status(404).json({ mensaje: 'Salida no encontrada' });
  res.json(s);
};

exports.crear = (req, res) => {
  const errores = validar(req.body, true);
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });
  const data = leer();
  const id = data.reduce((m, s) => Math.max(m, s.id), 0) + 1; // autogenerado
  const nueva = { id, ...limpiar(req.body) };
  data.push(nueva);
  guardar(data);
  res.status(201).json(nueva);
};

exports.actualizar = (req, res) => {
  const data = leer();
  const i = data.findIndex((x) => x.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ mensaje: 'Salida no encontrada' });
  // En edición solo se exige fecha futura si la fecha cambió.
  const cambioFecha = req.body.fechaHora !== data[i].fechaHora;
  const errores = validar(req.body, cambioFecha);
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });
  data[i] = { id: data[i].id, ...limpiar(req.body) };
  guardar(data);
  res.json(data[i]);
};

exports.eliminar = (req, res) => {
  const data = leer();
  const i = data.findIndex((x) => x.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ mensaje: 'Salida no encontrada' });
  data.splice(i, 1);
  guardar(data);
  res.status(204).end();
};

exports.destinos = (req, res) => {
  res.json([...new Set(leer().map((s) => s.destino))].sort());
};
