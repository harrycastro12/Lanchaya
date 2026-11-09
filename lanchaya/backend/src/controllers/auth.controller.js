// Login con JWT. Usuarios en data/usuarios.json con contraseña hasheada (bcrypt).
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRA } = require('../config');

const DB = path.join(__dirname, '../data/usuarios.json');
const leer = () => JSON.parse(fs.readFileSync(DB, 'utf8'));
const guardar = (d) => fs.writeFileSync(DB, JSON.stringify(d, null, 2));

// Hash ficticio para igualar el tiempo de respuesta cuando el usuario no existe
// (evita revelar qué usuarios existen midiendo la demora).
const HASH_FALSO = bcrypt.hashSync('no-existe', 10);

// Crea un usuario (lo usan el script CLI y el seed inicial).
exports.crearUsuario = (usuario, password) => {
  const data = leer();
  const u = String(usuario).trim().toLowerCase();
  if (data.some((x) => x.usuario === u)) throw new Error(`El usuario "${u}" ya existe`);
  const id = data.reduce((m, x) => Math.max(m, x.id), 0) + 1;
  data.push({ id, usuario: u, passwordHash: bcrypt.hashSync(password, 10) });
  guardar(data);
  return { id, usuario: u };
};

// Si no hay usuarios, crea un admin inicial (variables ADMIN_USER / ADMIN_PASS o valores de desarrollo).
exports.seedAdmin = () => {
  if (leer().length > 0) return;
  const usuario = process.env.ADMIN_USER || 'admin';
  const pass = process.env.ADMIN_PASS || 'admin123';
  exports.crearUsuario(usuario, pass);
  console.warn(`⚠️  Usuario inicial creado: "${usuario}" / "${pass}". Cámbialo (npm run crear-usuario) antes de publicar.`);
};

exports.login = (req, res) => {
  const { usuario, password } = req.body || {};
  if (typeof usuario !== 'string' || typeof password !== 'string' || !usuario.trim() || !password) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
  }
  const u = leer().find((x) => x.usuario === usuario.trim().toLowerCase());
  const ok = bcrypt.compareSync(password, u ? u.passwordHash : HASH_FALSO);
  if (!u || !ok) return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });

  const token = jwt.sign({ sub: u.id, usuario: u.usuario }, JWT_SECRET, { expiresIn: JWT_EXPIRA });
  res.json({ token, usuario: { id: u.id, usuario: u.usuario } });
};

// Devuelve el usuario del token (sirve al frontend para validar la sesión guardada).
exports.me = (req, res) => res.json({ usuario: req.usuario });
