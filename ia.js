require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");

// ═══════════════════════════════════════════════════════════
// 📖 CARGAR PROMPT DEL SISTEMA
// ═══════════════════════════════════════════════════════════
// Lee el archivo prompts/system.txt para darle personalidad al bot.
// El usuario puede editar este archivo sin tocar código.
// ═══════════════════════════════════════════════════════════
const systemPrompt = fs.readFileSync(
    path.join(__dirname, "prompts", "system.txt"),
    "utf8"
);

/**
 * Consulta la API de Groq y devuelve la respuesta de la IA.
 * @param {string} mensaje - Texto enviado por el usuario
 * @returns {Promise<string>} - Respuesta de la IA o mensaje de error amigable
 */
async function preguntarIA(mensaje) {
    try {
        const respuesta = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: mensaje
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                // Timeout de 30 segundos para evitar que se quede colgado
                timeout: 30000
            }
        );

        return respuesta.data.choices[0].message.content;

    } catch (error) {
        // ── Log detallado para depuración ──
        const errMsg = error.response?.data?.error?.message || error.message;
        const status = error.response?.status;

        console.error("[IA Error] Status:", status, "-", errMsg);

        // ── Respuestas amigables según el tipo de error ──
        if (status === 401) {
            return "⚠️ Error de autenticación. Verifica que tu GROQ_API_KEY sea correcta en el archivo .env";
        }

        if (status === 429) {
            return "⏳ Estoy recibiendo muchas solicitudes. Por favor espera un momento e intenta de nuevo.";
        }

        if (error.code === "ECONNABORTED") {
            return "⏳ La consulta tardó demasiado. Intenta de nuevo en unos segundos.";
        }

        if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
            return "📡 No puedo conectarme con el servicio de IA. Revisa tu conexión a internet.";
        }

        return "Lo siento, ocurrió un error al consultar la IA. Intenta de nuevo más tarde.";
    }
}

module.exports = preguntarIA;