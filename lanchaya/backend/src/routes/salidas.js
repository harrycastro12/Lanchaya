const router = require('express').Router();
const c = require('../controllers/salidas.controller');
const requireAuth = require('../middleware/auth');

// Lectura pública
router.get('/destinos', c.destinos);
router.get('/salidas', c.listar);
router.get('/salidas/:id', c.detalle);

// Escritura protegida con JWT
router.post('/salidas', requireAuth, c.crear);
router.put('/salidas/:id', requireAuth, c.actualizar);
router.delete('/salidas/:id', requireAuth, c.eliminar);

module.exports = router;
