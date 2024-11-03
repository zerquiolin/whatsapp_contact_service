// Libraries
import axios from "axios";
// Helpers
import { sendMessage, whatsapp_audio_transcription } from "./helpers";

export const textHandler = async (text: string) => {
  try {
    await sendMessage(
      "¡Gracias por tu mensaje! 📬 Estamos en ello y en breve tendrás una respuesta 😊"
    );
    const url = "https://5418-201-221-122-178.ngrok-free.app";
    const response = await axios.post(`${url}/whatsapp_webhook`, {
      message: text,
    });
    if (
      response.data.response.texto.includes(
        "inventario actual de productos Belcorp:"
      )
    ) {
      await sendMessage(response.data.response.texto);
      for (const product of response.data.response.productos) {
        await sendMessage(
          `Tienes un ${product.nombre} con ${product.cantidad} unidades. \nSu precio de compra es $${product.precio_compra}, te sugerimos venderlo a $${product.precio_venta}.`,
          [product.imagen]
        );
      }
    } else {
      await sendMessage(response.data.response);
    }
  } catch (error) {
    await sendMessage(
      "Ups, parece que algo salió mal y no pudimos procesar tu mensaje 😢. ¡Intenta de nuevo en un momento!"
    );
  }
};

// Función de manejo de audio
export const audioHandler = async (audioUrl: string) => {
  try {
    await sendMessage(
      "🎶 ¡Recibimos tu audio! Déjanos un momento para procesarlo y te responderemos en breve 😊"
    );
    const transcription = await whatsapp_audio_transcription(audioUrl);
    const replyText =
      transcription ||
      "No logré entender el audio del todo 😅. ¿Podrías intentarlo de nuevo? ¡Me encantaría ayudarte!";
    await sendMessage(replyText);
    const url = "https://5418-201-221-122-178.ngrok-free.app";
    const response = await axios.post(`${url}/whatsapp_webhook`, {
      message: transcription,
    });

    if (response.data.response.productos) {
      await sendMessage(response.data.response.texto);
      for (const product of response.data.response.productos) {
        await sendMessage(
          `Tienes un ${product.nombre} con ${product.cantidad} unidades. \nSu precio de compra es $${product.precio_compra}, te sugerimos venderlo a $${product.precio_venta}.`,
          [product.imagen]
        );
      }
    } else {
      await sendMessage(response.data.response);
    }
  } catch (error) {
    await sendMessage(
      "Oh no, parece que hubo un problemita con tu audio 😢. ¿Podrías intentarlo de nuevo?"
    );
  }
};
