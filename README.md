# 🤖 Asistente de WhatsApp con IA (IA en Acción)

Construye tu propio bot de WhatsApp conectado a la API gratuita de Groq (modelo Llama 3.3) en menos de 20 minutos. Diseñado para ser fácil de entender, rápido de implementar y completamente personalizable sin necesidad de saber programar a fondo.

Este proyecto es parte de la serie de tutoriales del canal **IA en Acción**.

---
<img width="1536" height="1024" alt="ChatGPT Image 7 ago 2026, 06_54_03 a m" src="https://github.com/user-attachments/assets/dfbc497f-ab41-4656-8bb2-46c35f359b32" />

## ✨ Características

*   **100% Gratis:** Utiliza Node.js, Baileys y la API gratuita de Groq.
*   **Fácil de personalizar:** Cambia la personalidad del bot editando un simple archivo de texto (`system.txt`), sin tocar el código.
*   **Arquitectura limpia:** Cada archivo tiene una única responsabilidad para que sea fácil de estudiar y escalar.
*   **Respuestas rápidas:** Integración optimizada para mantener conversaciones fluidas.

---

## 🚀 Instalación en 4 Pasos

### 1. Descarga el proyecto
Clona este repositorio o descárgalo como ZIP y extraelo en tu computadora.
```bash
cd asistente-whats
https://github.com/IA-en-Accion/whatsapp-ai-assistant.git

2. Instala las dependencias
Asegúrate de tener Node.js (versión 18 o superior) instalado.

Bash
npm install
3. Configura tu entorno
Copia el archivo de ejemplo y crea tu archivo .env:

Bash
cp .env.example .env
Abre el archivo .env recién creado y pega tu API Key de console.groq.com:

Fragmento de código
GROQ_API_KEY=gsk_tu_api_key_aqui
4. Dale personalidad a tu bot
Abre el archivo prompts/system.txt y escribe cómo quieres que se comporte tu asistente. ¡Tú decides quién es y cómo responde!

🎮 ¡Arranca el Bot!
Inicia el proyecto con el siguiente comando:

Bash
npm start
Aparecerá un código QR en tu terminal.

Abre WhatsApp en tu celular > Dispositivos vinculados > Vincular un dispositivo.

Escanea el QR.

¡Listo! Envíate un mensaje a ti mismo para probar cómo responde la IA.

📂 Estructura del Proyecto
Para mantener el código limpio y accesible, hemos separado las responsabilidades:

index.js ➔ Controla la conexión con WhatsApp (Baileys) y coordina el flujo.

ia.js ➔ Se comunica exclusivamente con el modelo de IA (Groq).

prompts/system.txt ➔ Define la personalidad del asistente (editable por el usuario).

webapp.js ➔ Preparado para un futuro panel web de administración.

sessions/ ➔ (Se genera sola) Guarda tu sesión de WhatsApp. No la compartas.

💡 Filosofía del Proyecto (IA en Acción)
No queremos que este sea solo un tutorial para "copiar y pegar código". El objetivo es que entiendas la arquitectura desde el primer día. Al separar las responsabilidades, el proyecto es fácil de entender, mantener y ampliar.

Incluso si nunca has programado, podrás seguir la evolución de este código paso a paso en los próximos videos.

🛣️ Roadmap de Próximas Mejoras
Este repositorio crecerá a lo largo de la serie de YouTube. Lo que viene:

[ ] Episodio 2: Panel web interactivo (QR en navegador y estado del bot).

[ ] Episodio 3: Memoria y contexto de historial de chat.

[ ] Episodio 4: Integración con Base de Datos.

[ ] Episodio 5 & 6: Múltiples usuarios y agentes IA.

[ ] Episodio 7: Despliegue en un VPS (Servidor 24/7).

[ ] Episodio 8: Transición a la API Oficial de WhatsApp.

[ ] Episodio 9 & 10: Dashboard profesional y publicación como SaaS.

⚠️ Notas Importantes
Si cambias de número o cierras sesión desde tu celular, simplemente elimina la carpeta sessions/ y vuelve a ejecutar npm start para escanear un nuevo QR.

NUNCA subas tu archivo .env ni tu carpeta sessions/ a ningún repositorio público.
