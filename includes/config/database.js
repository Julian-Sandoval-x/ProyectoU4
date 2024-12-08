import dotenv from "dotenv";
import { createConnection } from "mysql2";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

export default db;
