// Configuración central. En producción define JWT_SECRET (cadena larga y aleatoria).
const esProd = process.env.NODE_ENV === 'production';

if (esProd && !process.env.JWT_SECRET) {
  console.error('❌ Falta la variable de entorno JWT_SECRET en producción.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET no definido: usando un secreto de DESARROLLO. No lo uses en producción.');
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'lanchaya-secreto-solo-desarrollo',
  JWT_EXPIRA: process.env.JWT_EXPIRA || '2h',
};
