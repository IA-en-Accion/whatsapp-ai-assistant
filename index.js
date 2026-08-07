require("dotenv").config();

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");
const preguntarIA = require("./ia");

const C = {
    reset:   "\x1b[0m",
    bright:  "\x1b[1m",
    dim:     "\x1b[2m",
    rojo:    "\x1b[31m",
    verde:   "\x1b[32m",
    amarillo:"\x1b[33m",
    azul:    "\x1b[34m",
    magenta: "\x1b[35m",
    cyan:    "\x1b[36m",
    blanco:  "\x1b[37m",
    gris:    "\x1b[90m",
};

// ── CONTROL DE DEBUG ──
// Cambia a 'true' si en algún momento necesitas volver a ver los logs de depuración
const MOSTRAR_DEBUG = false; 

function logDebug(label, data) {
    if (!MOSTRAR_DEBUG) return; // Si está en false, no imprime nada
    console.log(C.gris + `[DEBUG] ${label}:` + C.reset, data);
}

function mostrarBanner() {
    console.log(C.cyan + C.bright);
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║                                                              ║");
    console.log("║           🤖  IA EN ACCIÓN  -  WHATSAPP BOT                  ║");
    console.log("║                                                              ║");
    console.log("║      Asistente conectado a Groq (Llama 3.3)                  ║");
    console.log("║                                                              ║");
    console.log("╚══════════════════════════════════════════════════════════════╝");
    console.log(C.reset);
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function limpiarNumero(jid) {
    return jid.replace(/[^0-9]/g, "");
}

function normalizarJid(jid) {
    if (!jid) return "";
    return jid.split(":")[0].split("@")[0];
}

let reconectando = false;
let miJid = null;
let miNumero = null;

// ═══════════════════════════════════════════════════════════
// 🛡️ PROTECCIÓN ANTI-BUCLE
// Guarda chats donde el bot acaba de responder. Si llega un
// mensaje fromMe de ese chat dentro de 3 segundos, es el eco
// de nuestra propia respuesta → lo ignoramos.
// ═══════════════════════════════════════════════════════════
const chatsRespondiendo = new Set();

async function iniciarBot() {
    mostrarBanner();

    const fs = require("fs");
    const path = require("path");
    const promptPath = path.join(__dirname, "prompts", "system.txt");

    if (!fs.existsSync(promptPath)) {
        console.log(C.rojo + "✗ No se encontró prompts/system.txt" + C.reset);
        process.exit(1);
    }

    if (!process.env.GROQ_API_KEY) {
        console.log(C.rojo + "✗ Falta GROQ_API_KEY en .env" + C.reset);
        process.exit(1);
    }

    console.log(C.verde + "✓ Configuración OK" + C.reset);
    console.log(C.verde + `✓ Conectando a WhatsApp...${C.reset}`);
    console.log();

    const { state, saveCreds } = await useMultiFileAuthState("sessions");

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async ({ connection, qr, lastDisconnect }) => {
        if (qr) {
            console.clear();
            mostrarBanner();
            console.log(C.amarillo + "✓ Conectando a WhatsApp..." + C.reset);
            console.log();
            qrcode.generate(qr, { small: true });
            console.log(C.cyan + "\n📲 Escanea el QR\n" + C.reset);
        }

        if (connection === "open") {
            miJid = sock.user.id;
            miNumero = normalizarJid(miJid);

            console.clear();
            mostrarBanner();
            console.log(C.verde + C.bright + "✓ WhatsApp conectado" + C.reset);
            console.log(C.gris + `  miJid guardado: ${miJid}` + C.reset);
            console.log(C.gris + `  miNumero: ${miNumero}` + C.reset);
            console.log();
            console.log(C.magenta + "Esperando mensajes..." + C.reset);
            console.log();
            console.log(C.amarillo + "💡 Envíate un mensaje a ti mismo para probar." + C.reset);
            console.log();
        }

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode === DisconnectReason.loggedOut) {
                console.log(C.rojo + "\n✗ Sesión cerrada. Elimina 'sessions' y reinicia." + C.reset);
                return;
            }
            if (!reconectando) {
                reconectando = true;
                console.log(C.rojo + "\n⚠ Conexión perdida. Reconectando en 5s...\n" + C.reset);
                await delay(5000);
                reconectando = false;
                iniciarBot();
            }
        }
    });

    // ═══════════════════════════════════════════════════════
    // 💬 MENSAJES CON DEBUG EN CADA PASO
    // ═══════════════════════════════════════════════════════
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        try {
            logDebug("Evento messages.upsert disparado", `type=${type}, cantidad=${messages.length}`);

            const msg = messages[0];
            if (!msg) {
                logDebug("msg es undefined", "return");
                return;
            }

            logDebug("msg.key", JSON.stringify(msg.key));
            logDebug("msg.message existe?", !!msg.message);

            if (!msg.message) {
                logDebug("Sin msg.message", "return");
                return;
            }

            // Ignorar mensajes de protocolo/estado
            if (msg.message?.protocolMessage || msg.message?.ephemeralMessage) {
                logDebug("Es protocol/ephemeral message", "return");
                return;
            }

            // ── FIX 1: Usar remoteJidAlt cuando el JID principal sea @lid ──
            const remoteJidRaw = msg.key.remoteJidAlt || msg.key.remoteJid || "";
            const remoteNumero = normalizarJid(remoteJidRaw);
            const esFromMe = msg.key.fromMe === true;
            const chatId = normalizarJid(remoteJidRaw);

            logDebug("remoteJidRaw", remoteJidRaw);
            logDebug("remoteNumero (normalizado)", remoteNumero);
            logDebug("esFromMe", esFromMe);
            logDebug("miNumero", miNumero);
            logDebug("¿remoteNumero === miNumero?", remoteNumero === miNumero);

            // ── FIX 2: Anti-bucle ──
            if (esFromMe && chatsRespondiendo.has(chatId)) {
                logDebug("fromMe=true y chat en anti-bucle", "IGNORADO (eco de respuesta)");
                return;
            }

            // Si es mensaje propio pero NO es para mí mismo, ignorar
            if (esFromMe && remoteNumero !== miNumero) {
                logDebug("fromMe=true pero NO es para mi mismo", "IGNORADO");
                return;
            }

            // ── Extraer texto ──
            const texto =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                msg.message.videoMessage?.caption ||
                "";

            logDebug("texto extraído", `"${texto}"`);

            if (!texto.trim()) {
                logDebug("texto vacío", "return");
                return;
            }

            const nombre = msg.pushName || "Sin nombre";

            console.log(C.cyan + "═══════════════════════════════════════════════════════════════" + C.reset);
            console.log(C.amarillo + C.bright + "📩  Mensaje recibido" + C.reset);
            if (esFromMe && remoteNumero === miNumero) {
                console.log(C.magenta + "    [🧪 Modo prueba: mensaje enviado a ti mismo]" + C.reset);
            }
            console.log(C.blanco + `    Usuario : ${C.bright}${nombre}${C.reset}`);
            console.log(C.blanco + `    Número  : ${C.gris}${remoteNumero}${C.reset}`);
            console.log();
            console.log(C.blanco + `    Mensaje : "${texto}"${C.reset}`);
            console.log(C.cyan + "═══════════════════════════════════════════════════════════════" + C.reset);

            // ── Consultar IA ──
            console.log();
            console.log(C.magenta + "🤖  Consultando IA..." + C.reset);
            logDebug("Llamando a preguntarIA...", "...");

            const inicio = Date.now();
            const respuesta = await preguntarIA(texto);
            const duracion = ((Date.now() - inicio) / 1000).toFixed(2);

            logDebug("Respuesta de IA recibida", `"${respuesta.substring(0, 80)}..."`);
            console.log(C.verde + `✓  Respuesta generada en ${C.bright}${duracion}s${C.reset}`);
            console.log(C.cyan + "═══════════════════════════════════════════════════════════════" + C.reset);
            console.log();

            // ── Enviar respuesta ──
            logDebug("Enviando respuesta a", remoteJidRaw);

            // 🛡️ Activar protección anti-bucle ANTES de enviar
            chatsRespondiendo.add(chatId);
            setTimeout(() => chatsRespondiendo.delete(chatId), 3000);

            await sock.sendMessage(msg.key.remoteJid, { text: respuesta });
            logDebug("sendMessage completado", "OK");

        } catch (error) {
            console.error(C.rojo + "\n✗ Error en messages.upsert:" + C.reset, error.message);
            console.error(C.gris + "  Stack:", error.stack + C.reset);
        }
    });
}

process.on("uncaughtException", (err) => {
    console.error(C.rojo + "\n✗ uncaughtException:" + C.reset, err.message);
});

process.on("unhandledRejection", (reason) => {
    console.error(C.rojo + "\n✗ unhandledRejection:" + C.reset, reason);
});

iniciarBot();