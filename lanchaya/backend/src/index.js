const express = require('express');
const cors = require('cors');
const rutas = require('./routes/salidas');
const rutasAuth = require('./routes/auth');
const { seedAdmin } = require('./controllers/auth.controller');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', rutasAuth);
app.use('/api', rutas);

// 404 para rutas desconocidas
app.use((req, res) => res.status(404).json({ mensaje: 'Ruta no encontrada' }));

// Middleware de manejo de errores (JSON mal formado, fallos inesperados)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ mensaje: 'JSON inválido' });
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

seedAdmin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LanchaYa API en http://localhost:${PORT}`));
