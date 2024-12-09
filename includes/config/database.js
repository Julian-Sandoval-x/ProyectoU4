import dotenv from "dotenv";
import { createConnection, createPool } from "mysql2";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const db = createPool({
  host: "autorack.proxy.rlwy.net",
  user: "root",
  password: "fkPYZOChHznaSqGQwokzTKorSBJfPMIi",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 segundos
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

export default db;
