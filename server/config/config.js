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
process.env.CADUCIDAD_TOKEN = '3h';

//=====================
// SEED de Autenticación
//=====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';

//=====================
// Base de Datos
//=====================
process.env.URL_DB = process.env.MONGO_URL ? process.env.MONGO_URL : 'mongodb://localhost:27017/cafe';

//=====================
// Google Client ID
//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '369814469174-v1h9okm5uves1m5377oscckrmbi6u7ck.apps.googleusercontent.com';