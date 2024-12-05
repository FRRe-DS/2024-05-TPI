import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./config.js";
import indexRoutes from "./routes/index.routes.js";
import eventosRoutes from "./routes/eventos.routes.js";
import obrasRoutes from "./routes/obras.routes.js";
import escultoresRoutes from "./routes/escultores.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import votaRoutes from "./routes/vota.routes.js";
import imagenesRoutes from "./routes/imagenes.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { initialSetup } from "./libs/initialSetup.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Agregar dependencias para WebSockets
import { Server } from "socket.io";
import http from "http";

// Configuración del servidor HTTP
const app = express();
const server = http.createServer(app); // Crear servidor HTTP con Express

// Configuración de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes desde el nuevo dominio y localhost
      if (
        !origin ||
        origin === `http://${process.env.HOST}:${process.env.PORT || 5173}` ||
        origin === `http://localhost:5173`
      ) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Configuración de rutas API
app.use("/api", authRoutes);
app.use("/api/escultores/", escultoresRoutes);
app.use("/api/", eventosRoutes);
app.use("/api", indexRoutes);
app.use("/api/obras", obrasRoutes);
app.use("/api/imagenes", imagenesRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/vota", votaRoutes);

// Configuración de WebSockets
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Permite solicitudes desde el nuevo dominio y localhost
      if (
        !origin ||
        origin === `http://${process.env.HOST}:${process.env.PORT || 5173}` ||
        origin === `http://localhost:5173`
      ) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  },
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Exportar el objeto io para usarlo en otros módulos
export { io };

// Servir archivos estáticos del cliente generado por Vite
const __dirname = path.resolve(); // Obtener el directorio actual
app.use(express.static(path.join(__dirname, "client/dist")));

// Manejar rutas no definidas y redirigir al index.html del cliente
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Inicialización de configuraciones específicas
initialSetup();

// Cambiar app.listen por server.listen para incluir WebSockets
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
