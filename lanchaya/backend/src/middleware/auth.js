// Exige un JWT válido en el header "Authorization: Bearer <token>".
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = function requireAuth(req, res, next) {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) return res.status(401).json({ mensaje: 'Debes iniciar sesión' });
  try {
    const p = jwt.verify(token, JWT_SECRET);
    req.usuario = { id: p.sub, usuario: p.usuario };
    next();
  } catch (e) {
    const expirado = e.name === 'TokenExpiredError';
    res.status(401).json({ mensaje: expirado ? 'Tu sesión expiró, inicia sesión de nuevo' : 'Token inválido' });
  }
};
