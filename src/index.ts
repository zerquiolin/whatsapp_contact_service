// Libraries
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import cors from "cors";
// Controllers
import {
  whatsappController,
  audioController,
  errorMiddleware,
} from "./scripts/controllers";

const PORT = process.env.PORT ?? 3000;

// Configuración del servidor
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

// Configuración de Multer para manejar archivos
const upload = multer({ dest: "uploads/" });

// Rutas
app.post("/whatsapp", whatsappController);
app.post("/audio", upload.single("audio"), audioController);

// Middleware de manejo de errores global
app.use(errorMiddleware);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`El servidor está ejecutándose en el puerto ${PORT}`);
});
