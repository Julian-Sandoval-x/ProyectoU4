import dotenv from "dotenv";
import { createPool } from "mysql2";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear el pool de conexiones
const db = createPool({
  host: process.env.DB_HOST || "autorack.proxy.rlwy.net",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "fkPYZOChHznaSqGQwokzTKorSBJfPMIi",
  database: process.env.DB_NAME || "railway",
  port: 3306, // Asegúrate de especificar el puerto
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 100000, // 10 segundos
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
