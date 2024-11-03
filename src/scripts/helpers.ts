import fs from "fs";
import path from "path";
import axios from "axios";
import twilio from "twilio";
import { SpeechClient } from "@google-cloud/speech";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);
const speechClient = new SpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const whatsapp_audio_transcription = async (
  audioUrl: string
): Promise<string | null> => {
  const audioPath = path.join(__dirname, "received_audio.ogg");
  try {
    const audioResponse = await axios.get(audioUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${accountSid}:${authToken}`
        ).toString("base64")}`,
      },
    });
    fs.writeFileSync(audioPath, audioResponse.data);
    const audioBytes = fs.readFileSync(audioPath).toString("base64");
    const [response] = await speechClient.recognize({
      audio: { content: audioBytes },
      config: {
        encoding: "OGG_OPUS",
        sampleRateHertz: 16000,
        languageCode: "es-ES",
      },
    });
    const transcription = response.results
      ?.map((result) => result?.alternatives?.[0].transcript)
      .join(" ");
    fs.unlinkSync(audioPath);
    return transcription ?? null;
  } catch (error) {
    console.error("Error al transcribir el audio:", error);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    return null;
  }
};

// Función de transcripción de audio en MP3
export const audio_transcription = async (
  audio: string
): Promise<string | null> => {
  try {
    const [response] = await speechClient.recognize({
      audio: { content: audio },
      config: {
        encoding: "MP3",
        languageCode: "es-ES",
        sampleRateHertz: 16000,
      },
    });
    const transcription = response.results
      ?.map((result) => result?.alternatives?.[0].transcript)
      .join(" ");
    return transcription ?? null;
  } catch (error) {
    console.error("Error al transcribir el audio:", error);
    return null;
  }
};

// Función para enviar un mensaje simple
export const sendMessage = async (body: string, mediaUrl?: string[]) => {
  try {
    await twilioClient.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+573125015229",
      body,
      mediaUrl,
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};
