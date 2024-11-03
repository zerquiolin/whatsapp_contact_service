// Libraries
import fs from "fs";
// Helpers
import { audio_transcription, sendMessage } from "./helpers";
import { textHandler, audioHandler } from "./handlers";
// Types
import type { Request, Response, NextFunction } from "express";

export const audioController = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No se encontró ningún archivo" });
    return; // Asegúrate de terminar aquí si falta el archivo
  }

  const filePath = req.file.path;

  try {
    // Convertir el archivo de audio a base64
    const audioBase64 = fs.readFileSync(filePath).toString("base64");

    // Llamar a la función de transcripción con el audio en base64
    const transcription = await audio_transcription(audioBase64);

    // Eliminar el archivo temporal después de la transcripción
    fs.unlinkSync(filePath);

    // Enviar la respuesta sin devolverla explícitamente
    res.status(200).json({
      message: "Transcripción completada",
      transcription: transcription || "No se pudo transcribir el audio",
    });
  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({
      message:
        "Tenemos un problema al procesar el archivo de audio, por favor intenta de nuevo",
    });
  }
};
export const whatsappController = async (req: Request, res: Response) => {
  const { Body, MessageType, MediaUrl0, From } = req.body;

  try {
    if (MessageType === "text") {
      await textHandler(Body);
    } else if (MessageType === "audio") {
      await audioHandler(MediaUrl0);
    } else {
      console.log("Tipo de mensaje no manejado:", req.body);
      await sendMessage(
        "🤔 ¡Oops! Aún no puedo manejar este tipo de mensaje. Por ahora, puedes enviarme texto o audio. ¡Gracias por tu paciencia! 😊"
      );
    }

    res.status(200).send("Mensaje procesado");
  } catch (error) {
    console.error("Error en el controlador de WhatsApp:", error);
    await sendMessage(
      "😔 Lo siento, hubo un problemita al procesar tu mensaje. Inténtalo de nuevo en un momento."
    );
    res.status(500).send("Error al procesar el mensaje");
  }
};

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error detectado:", err);

  // Estructura de respuesta de error
  const errorResponse = {
    message: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Mostrar el stack solo en desarrollo
  };

  // Send Message
  sendMessage(
    "😔 Lo siento, hubo un problema al procesar tu mensaje. Inténtalo de nuevo en un momento."
  );

  // Envía el error como respuesta
  res.status(err.status || 500).json(errorResponse);
};
