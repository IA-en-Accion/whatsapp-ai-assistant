# 🤖 Asistente de WhatsApp con IA (IA en Acción)

Construye tu propio bot de WhatsApp conectado a la API gratuita de Groq (modelo Llama 3.3) en menos de 20 minutos. Diseñado para ser fácil de entender, rápido de implementar y completamente personalizable, sin necesidad de saber programar a fondo.

Este proyecto es parte de la serie de tutoriales del canal **IA en Acción**.

![ChatGPT Image](https://github.com/user-attachments/assets/dfbc497f-ab41-4656-8bb2-46c35f359b32)

---

## ✨ Características

- **100% Gratis:** Utiliza Node.js, Baileys y la API gratuita de Groq.
- **Fácil de personalizar:** Cambia la personalidad del bot editando un simple archivo de texto (`system.txt`), sin tocar el código.
- **Arquitectura limpia:** Cada archivo tiene una única responsabilidad para que sea fácil de estudiar y escalar.
- **Respuestas rápidas:** Integración optimizada para mantener conversaciones fluidas.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito | Versión | Descarga |
|-----------|---------|----------|
| **Node.js** | 18 o superior | [nodejs.org](https://nodejs.org/) |
| **npm** | Viene con Node.js | Incluido en la instalación de Node.js |
| **Git** | Cualquier versión reciente | [git-scm.com](https://git-scm.com/) |
| **Windows PowerShell** | (Solo Windows) | Incluido en Windows 10/11 |

&gt; 💡 **Tip:** Para verificar tu versión de Node.js, abre tu terminal y ejecuta:
&gt; ```bash
&gt; node -v
&gt; ```
&gt; Si no tienes Node.js, descárgalo desde [https://nodejs.org/](https://nodejs.org/) e instálalo.

---

## 🚀 Instalación Paso a Paso

### Paso 1: Descarga el proyecto

Abre tu terminal (PowerShell en Windows o Terminal en Mac/Linux) y ejecuta:

```bash
# Clona el repositorio
git clone https://github.com/IA-en-Accion/whatsapp-ai-assistant.git

# Entra a la carpeta del proyecto
cd whatsapp-ai-assistant

🔧 Alternativa: Si prefieres no usar Git, puedes descargar el proyecto como ZIP desde el botón verde "Code" > Download ZIP en GitHub, descomprimirlo y abrir la carpeta resultante.
Paso 2: Configura tu API Key de Groq
Ve a console.groq.com y regístrate (es gratis).
Crea una nueva API Key.
Guárdala bien, la necesitarás en el siguiente paso.
Paso 3: Configura el archivo de entorno
Dentro de la carpeta del proyecto encontrarás un archivo llamado .env.example. Debes copiarlo y renombrarlo:
bash
# Windows (PowerShell)
copy .env.example .env

# Mac / Linux
cp .env.example .env
Abre el archivo .env recién creado y pega tu API Key de Groq:
env
GROQ_API_KEY=gsk_pzcXE3*********************************************
⚠️ IMPORTANTE: Nunca subas este archivo .env a GitHub. Ya está incluido en .gitignore, pero verifica que no se suba por accidente.
Paso 4: Instala las dependencias
Ejecuta en tu terminal:
bash
npm install
Esto instalará automáticamente todas las librerías necesarias:
| Dependencia               | Versión | Propósito                       |
| ------------------------- | ------- | ------------------------------- |
| `@whiskeysockets/baileys` | ^6.x    | Conexión con WhatsApp Web       |
| `groq-sdk`                | ^0.x    | Comunicación con la API de Groq |
| `dotenv`                  | ^16.x   | Manejo de variables de entorno  |
| `qrcode-terminal`         | ^0.x    | Mostrar el QR en la terminal    |
| `pino`                    | ^8.x    | Logger para depuración          |
💡 Nota: La primera instalación puede tardar 1-2 minutos dependiendo de tu conexión.

Paso 5: Dale personalidad a tu bot
Abre el archivo prompts/system.txt y escribe cómo quieres que se comporte tu asistente.
Ejemplo - Experto Vendedor:
Eres un asistente virtual experto en ventas. Hablas de forma confiable, profesional 
y concisa. No des demasiada información de golpe. Escuchas primero, entiendes la 
necesidad del cliente y luego ofreces soluciones. Usa un tono amigable pero 
empresarial.

🎨 Tip: Puedes pedirle a cualquier IA (ChatGPT, Claude, etc.) que te genere un system prompt personalizado para tu negocio y simplemente pegarlo en system.txt.

🎮 ¡Arranca el Bot!
Inicia el proyecto con:
bash
npm start
Aparecerá un código QR en tu terminal.
Abre WhatsApp en tu celular.
Ve a Ajustes > Dispositivos vinculados > Vincular un dispositivo.
Escanea el QR que aparece en la terminal.
¡Listo! Envíate un mensaje a ti mismo para probar cómo responde la IA.

📂 Estructura del Proyecto
Para mantener el código limpio y accesible, hemos separado las responsabilidades:

| Archivo / Carpeta    | Descripción                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `index.js`           | Controla la conexión con WhatsApp y coordina todo el flujo de mensajes.          |
| `ia.js`              | Se comunica exclusivamente con el modelo de IA (Groq).                           |
| `prompts/system.txt` | Define la personalidad del asistente (editable por el usuario).                  |
| `webapp.js`          | Preparado para un futuro panel web y funciones adicionales.                      |
| `sessions/`          | *(Se genera automáticamente)* Guarda tu sesión de WhatsApp. **No la compartas.** |

🛠️ Solución de Problemas (Errores Comunes)
❌ Error 1: node: command not found o 'node' no se reconoce
Causa: Node.js no está instalado o no está en el PATH del sistema.
Solución:
Descarga e instala Node.js desde nodejs.org (versión 18 o superior).
En Windows, reinicia PowerShell después de instalar.
Verifica con: node -v

❌ Error 2: Cannot find module '@whiskeysockets/baileys'
Causa: Las dependencias no se instalaron correctamente.
Solución:
bash
# Borra la carpeta de módulos y reinstala
rm -rf node_modules
npm install

❌ Error 3: GROQ_API_KEY is missing o 401 Unauthorized
Causa: El archivo .env no existe o la API Key está mal copiada.
Solución:
Verifica que copiaste .env.example a .env.
Asegúrate de que la línea comience con GROQ_API_KEY= (sin espacios).
La API Key debe comenzar con gsk_.

❌ Error 4: El QR aparece pero no escanea o da error
Causa: Problemas de sesión previa o caché de Baileys.
Solución:
bash
# Elimina la carpeta de sesiones y vuelve a generar el QR
rm -rf sessions
npm start

❌ Error 5: npm install falla con errores de permisos
Causa: Permisos insuficientes en la carpeta del proyecto.
Solución (Windows):
Ejecuta PowerShell como Administrador.
O usa: npm install --force
Solución (Mac/Linux):
bash
sudo npm install

❌ Error 6: El bot responde muy lento o no responde
Causa: Límite de rate de la API gratuita de Groq o problemas de conectividad.
Solución:
Verifica tu conexión a internet.
Revisa el estado de la API en status.groq.com.
Si es rate limit, espera unos segundos y reintenta.


💡 Filosofía del Proyecto (IA en Acción)
No queremos que este sea solo un tutorial para "copiar y pegar código". El objetivo es que entiendas la arquitectura desde el primer día. Al separar las responsabilidades, el proyecto es fácil de entender, mantener y ampliar.
Incluso si nunca has programado, podrás seguir la evolución de este código paso a paso en los próximos videos del canal.
🛣️ Roadmap de Próximas Mejoras
Este repositorio crecerá a lo largo de la serie de YouTube. Esto es lo que viene:
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
Este proyecto usa Baileys (librería no oficial) para conectarse a WhatsApp Web. Para uso comercial a gran escala, considera migrar a la API Oficial de WhatsApp Business (lo veremos en el Episodio 8).

📺 Canal de YouTube
Suscríbete a IA en Acción para no perderte ningún episodio de esta serie:
https://www.youtube.com/@IAen-accion

📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT. Siéntete libre de usarlo, modificarlo y compartirlo.

⭐ ¿Te funcionó?
Si este proyecto te fue útil, ¡dale una ⭐ al repositorio y compártelo! Tu apoyo nos ayuda a seguir creando contenido gratuito.
<p align="center">
  <b>Hecho con ❤️ por IA en Acción</b>
</p>
```

