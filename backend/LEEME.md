# Opiniones con IP encriptada, actualización y revisión de spam

Flujo: página → **Worker de Cloudflare** (ve la IP, la encripta, consulta a la IA de Groq) → **Apps Script** → hoja de Google.
Las opiniones que la IA marca como spam quedan en la hoja (columna `spam` = `si`) pero **no se muestran** en el sitio. Si una es real, cambiá `si` por `no` en la hoja.
Si la IA falla o no está configurada, la opinión queda como `sin revisar` y se muestra igual.

## Paso 1 – Apps Script
1. Abrí tu proyecto de Apps Script, reemplazá todo el código por `backend/apps-script.gs`.
2. Configuración del proyecto (engranaje) > Propiedades de la secuencia de comandos > agregá `SECRETO` = una clave larga inventada (guardala, la usás en el paso 3).
3. Implementar > Administrar implementaciones > lápiz > Versión: **Nueva versión** > Implementar (la URL no cambia).

## Paso 2 – Clave de Groq
Creá una cuenta gratis en console.groq.com > API Keys > Create API Key. Copiala.

## Paso 3 – Worker de Cloudflare
1. Cuenta gratis en cloudflare.com > Workers & Pages > Create > Worker > Deploy, luego "Edit code" y pegá `backend/worker.js`.
2. Settings > Variables and Secrets, agregá (tipo Secret): `APPS_SCRIPT_URL` (la URL /exec), `SECRETO` (la misma del paso 1), `SAL` (texto largo inventado, no lo cambies después porque se pierde el reconocimiento de IPs anteriores), `GROQ_API_KEY`.
3. Opcional: `GROQ_MODEL` si Groq retira el modelo por defecto, y `ORIGENES` con la dirección de tu sitio (ej. `https://tallersinfronteras.github.io`).
4. Copiá la URL del Worker (`https://....workers.dev`) y pasámela, o pegala en `paginas/opinion.html` en `var OPINION_API=''`.

Importante: hasta completar el paso 3 y pegar `OPINION_API`, el sitio sigue enviando directo a Google como antes.
Si ya cargaste `SECRETO` en Apps Script, los envíos directos dejan de funcionar (es lo esperado).
