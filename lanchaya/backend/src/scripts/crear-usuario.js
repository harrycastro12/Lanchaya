// Uso: npm run crear-usuario -- <usuario> <contraseña>
const { crearUsuario } = require('../controllers/auth.controller');
const [usuario, password] = process.argv.slice(2);
if (!usuario || !password || password.length < 6) {
  console.error('Uso: npm run crear-usuario -- <usuario> <contraseña (mín. 6 caracteres)>');
  process.exit(1);
}
try { console.log('✅ Usuario creado:', crearUsuario(usuario, password)); }
catch (e) { console.error('❌', e.message); process.exit(1); }
