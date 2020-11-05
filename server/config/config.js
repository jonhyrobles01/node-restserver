//=====================
// Puerto
//=====================
process.env.PORT = process.env.PORT || 8080;

//=====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
// Vencimiento del Token   
//=====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=====================
// SEED de Autenticación
//=====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

//=====================
// Base de Datos
//=====================
process.env.URL_DB = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/cafe';