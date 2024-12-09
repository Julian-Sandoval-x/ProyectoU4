import dotenv from "dotenv";
import { createPool } from "mysql2";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear el pool de conexiones
const db = createPool({
  host: "autorack.proxy.rlwy.net", // Usa variables de entorno para flexibilidad
  user: "root",
  password: "fkPYZOChHznaSqGQwokzTKorSBJfPMIi",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 segundos
});

// Verificar la conexión al inicializar
db.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión exitosa a la base de datos");
  connection.release(); // Libera la conexión inmediatamente
});

// Exportar el pool para su uso en el proyecto
export default db;
