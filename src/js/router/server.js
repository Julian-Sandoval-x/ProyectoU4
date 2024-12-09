import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../../../includes/config/database.js"; // Ajusta la ruta según la ubicación de tu archivo database.js

const app = express();
const port = 3000;
const secretKey = "your_secret_key"; // Cambia esto por una clave secreta segura

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta para servir archivos estáticos desde la carpeta 'public' y 'build' en la raíz del proyecto
app.use(express.static(path.join(__dirname, "../../../public")));
app.use(express.static(path.join(__dirname, "../../../build")));
app.use(express.static(path.join(__dirname, "../../../media")));

app.use(bodyParser.json());

// Ruta para servir el archivo create_user.html
app.get("/create_user", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../public/create_user.html"));
});

// Ruta para servir el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../public/index.html"));
});

// Ruta para servir el archivo menu.html
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../public/menu.html"));
});

// Ruta para servir el archivo login.html
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../public/login.html"));
});

// Ruta para servir el archivo pedidos.html
app.get("/pedidos", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../public/pedidos.html"));
});

// Middleware para verificar la autenticación del usuario
function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  const token = authHeader.split(" ")[1]; // Extrae el token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    req.userId = decoded.id; // Extrae el ID del usuario
    next();
  });
}

// Ruta para obtener los pedidos del usuario
app.get("/api/pedidos", isAuthenticated, (req, res) => {
  const userId = req.userId;

  const query = "SELECT * FROM pedidos WHERE idUser = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching orders from database:", err);
      return res.status(500).json({ message: "Error al obtener los pedidos" });
    }
    res.status(200).json(results);
  });
});

// Ruta para cancelar pedidos
app.patch("/api/pedidos/:id/cancelar", isAuthenticated, (req, res) => {
  const userId = req.userId; // Extraído del token JWT
  const pedidoId = req.params.id;

  // Verificar si el pedido pertenece al usuario y está pendiente
  const query =
    "SELECT * FROM pedidos WHERE id = ? AND idUser = ? AND estado = 'pendiente'";
  db.query(query, [pedidoId, userId], (err, results) => {
    if (err) {
      console.error("Error al verificar el pedido:", err);
      return res
        .status(500)
        .json({ message: "Error al procesar la solicitud" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Pedido no encontrado o no es cancelable" });
    }

    // Actualizar el estado del pedido a 'cancelado'
    const updateQuery = "UPDATE pedidos SET estado = 'cancelado' WHERE id = ?";
    db.query(updateQuery, [pedidoId], (err) => {
      if (err) {
        console.error("Error al actualizar el pedido:", err);
        return res
          .status(500)
          .json({ message: "No se pudo cancelar el pedido" });
      }

      res.status(200).json({ message: "Pedido cancelado con éxito" });
    });
  });
});

// Ruta para manejar la creación de usuarios
app.post("/create_user", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const query = "INSERT INTO usuarios (correo, password) VALUES (?, ?)";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Error inserting user into database:", err);
      return res.status(500).json({ message: "Error al registrar el usuario" });
    }
    res.status(201).json({ message: "Usuario registrado con éxito" });
  });
});

// Ruta para manejar el inicio de sesión
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }

  const query = "SELECT * FROM usuarios WHERE correo = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Error fetching user from database:", err);
      return res.status(500).json({ message: "Error al iniciar sesión" });
    }

    const user = results[0];
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ token });
  });
});

// Ruta para manejar la creación de pedidos
app.post("/api/pedidos", isAuthenticated, (req, res) => {
  const { cart, total } = req.body;
  const userId = req.userId;
  const folio = Math.random().toString(36).substring(2, 12).toUpperCase();
  const estado = "pendiente";

  const query =
    "INSERT INTO pedidos (folio, total, estado, idUser) VALUES (?, ?, ?, ?)";
  db.query(query, [folio, total, estado, userId], (err, results) => {
    if (err) {
      console.error("Error inserting order into database:", err);
      return res.status(500).json({ message: "Error al registrar el pedido" });
    }
    res.status(201).json({ message: "Pedido registrado con éxito" });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Ocurrió un error en el servidor" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
