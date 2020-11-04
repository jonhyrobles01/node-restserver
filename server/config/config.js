//=====================
// Puerto
//=====================
process.env.PORT = process.env.PORT || 8080;

//=====================
// Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
// Base de Datos
//=====================
let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe';
// } else {
//     urlDB = process.env.MONGO_URL;
// }
urlDB = 'mongodb+srv://jonhaz525:6pzExLLpx28FG3U@cluster0.gfkw4.mongodb.net/cafe';
process.env.URL_DB = urlDB;