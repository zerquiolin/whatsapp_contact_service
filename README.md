
# Proyecto de Integración de WhatsApp y Transcripción de Audio

Este proyecto implementa una API para interactuar con WhatsApp a través de la API de Twilio, con soporte para transcripción de audios usando la API de Google Cloud Speech-to-Text. El proyecto está desarrollado en TypeScript y organiza sus funcionalidades en controladores y manejadores específicos para cada tipo de mensaje.

## Tabla de Contenidos
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [Rutas de la API](#rutas-de-la-api)
- [Scripts](#scripts)
- [Dependencias](#dependencias)

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Asegúrate de tener configurado **TypeScript** globalmente (opcional):
   ```bash
   npm install -g typescript
   ```

4. Compila el proyecto con TypeScript:
   ```bash
   tsc
   ```

## Configuración

1. **Twilio**: Configura tu cuenta de Twilio en el archivo de configuración o mediante variables de entorno. Se requiere la cuenta SID y el token de autenticación.

2. **Google Cloud Speech-to-Text**: Asegúrate de tener configurado el acceso a Google Cloud Speech-to-Text para habilitar la transcripción de audio.

3. Crea un archivo `.env` en la raíz del proyecto para almacenar las variables sensibles:
   ```env
   TWILIO_ACCOUNT_SID=<Tu SID de Twilio>
   TWILIO_AUTH_TOKEN=<Tu Token de Twilio>
   GOOGLE_API_KEY=<Tu clave de API de Google>
   PORT=3000
   ```

## Estructura del Proyecto

```plaintext
├── src
│   ├── db
│   │   └── inventory.json       # Inventario de productos (base de datos JSON)
│   ├── scripts
│   │   ├── helpers.ts           # Funciones auxiliares para envío de mensajes y transcripción
│   │   ├── handlers.ts          # Manejadores para texto, audio y otros tipos de mensaje
│   │   └── controllers.ts       # Controladores de las rutas de la API
│   ├── uploads                  # Directorio de almacenamiento temporal para audios cargados
│   └── index.ts                 # Archivo principal de la API
├── tsconfig.json                # Configuración de TypeScript
└── .env                         # Variables de entorno (no incluido por seguridad)
```

## Uso

1. **Ejecuta el servidor**:
   ```bash
   npm start
   ```

2. **Enviar Mensajes y Archivos**: Utiliza herramientas como Postman para probar las rutas de la API y enviar diferentes tipos de mensajes a la API de WhatsApp.

3. **Verificar Respuestas**: Los mensajes de texto y audio enviados son procesados y respondidos a través de WhatsApp.

## Rutas de la API

### POST /whatsapp
Controlador principal para manejar mensajes de WhatsApp.

- **Descripción**: Procesa mensajes de texto y audio recibidos a través de Twilio.
- **Parámetros**:
  - `Body` (texto): Texto del mensaje enviado por el usuario.
  - `MessageType` (string): Tipo de mensaje (`text` o `audio`).
  - `MediaUrl0` (string): URL del archivo de audio, si el mensaje es de tipo `audio`.
- **Respuesta**:
  - `200 OK`: Mensaje procesado correctamente.

### POST /audio
Ruta para transcribir archivos de audio.

- **Descripción**: Recibe un archivo de audio y realiza su transcripción usando la API de Google Cloud.
- **Parámetros**:
  - `audio` (archivo): Archivo de audio en formato MP3 o OGG.
- **Respuesta**:
  - `200 OK`: Transcripción completada.
  - `500 Error`: Error en la transcripción.

### POST /text
Ruta para manejar mensajes de texto y responder según el inventario.

- **Descripción**: Procesa mensajes de texto y envía información de inventario basada en el mensaje.
- **Parámetros**:
  - `Body` (texto): Texto del mensaje enviado por el usuario.
- **Respuesta**:
  - `200 OK`: Mensaje de respuesta de inventario.

## Scripts

- **Compilar TypeScript**:
  ```bash
  tsc
  ```

- **Iniciar el Servidor**:
  ```bash
  npm start
  ```

## Dependencias

- **express**: Framework para construir la API.
- **axios**: Cliente HTTP para llamadas a la API.
- **twilio**: API de Twilio para enviar y recibir mensajes de WhatsApp.
- **@google-cloud/speech**: API de Google Cloud para transcripción de audio.
- **multer**: Middleware para manejar archivos en las solicitudes HTTP.
- **cors**: Permite configurar CORS para la API.

## Notas de Desarrollo

- El proyecto utiliza `multer` para manejar la carga de archivos de audio y almacenarlos temporalmente en el servidor antes de la transcripción.
- Todos los mensajes se gestionan a través de `whatsappController` y `audioController`, con funciones de ayuda para la transcripción (`whatsapp_audio_transcription`) y envío de mensajes (`sendMessage`).
- La transcripción de audio depende de la API de Google Cloud y el formato de audio aceptado, que puede requerir conversión si no está en el formato correcto.

---

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
