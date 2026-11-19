# Taller: Tarjeta de presentación con chatbot en Azure

Cada estudiante publica en internet una tarjeta personal tipo gafete ("Hola, soy…") con un asistente de IA que responde preguntas sobre su perfil.

**Servicios de Azure que se aprenden:** Azure Static Web Apps, Azure Functions (API integrada) y Azure OpenAI (desde Azure AI Foundry).

**Duración sugerida:** 2.5 a 3 horas.

> Los nombres de menús del portal de Azure cambian con frecuencia. Si algo no coincide, busca la opción equivalente o consulta la documentación de Microsoft Learn.

---

## Estructura del proyecto

```
web/                  Página que ve el visitante
  index.html
  estilos.css         Cambia aquí el color (--acento)
  app.js
api/                  Azure Functions (corren en el servidor)
  src/perfil.js       ✏️ Tus datos: lo único que debes editar
  src/functions/perfil.js   GET  /api/perfil
  src/functions/chat.js     POST /api/chat  → llama a Azure OpenAI
  local.settings.example.json
```

**Idea clave de seguridad:** la página nunca conoce la clave de IA. El navegador llama a `/api/chat`, y es la función en Azure la que usa la clave, guardada como variable de entorno. Si la clave estuviera en `app.js`, cualquiera podría copiarla y gastar tu crédito.

---

## Antes del taller (instructor)

1. Verifica que los estudiantes hayan activado **Azure for Students** y que tengan cuenta de **GitHub**.
2. Comprueba que en esas suscripciones se puedan crear recursos de **Azure OpenAI / Azure AI Foundry** y qué modelos están disponibles en tu región. Las condiciones cambian; pruébalo tú primero con una cuenta de estudiante.
3. Sube este proyecto a un repositorio de GitHub que funcione como plantilla (*Settings → Template repository*).
4. Ten un plan B: si algún estudiante no puede crear el recurso de IA, puede usar el endpoint de un compañero o del instructor durante la sesión (configurando la clave en su Static Web App, nunca en el código), o simplemente desplegar la tarjeta sin chat.

---

## Paso 1. Copia la plantilla y personalízala (20 min)

1. En GitHub, pulsa **Use this template → Create a new repository** (público o privado).
2. Edita `api/src/perfil.js` con tus datos: nombre, rol, frase, intereses, enlaces y el texto `sobreMi`.
3. Opcional: en `web/estilos.css` cambia `--acento` por tu color favorito.

⚠️ Todo lo que escribas en `perfil.js` será público. No pongas teléfono, dirección, correo personal ni datos sensibles.

## Paso 2. Crea el modelo de IA (30 min)

1. En el portal de Azure crea un **grupo de recursos**, por ejemplo `rg-taller-tarjeta`. Todo lo del taller irá aquí.
2. Crea un recurso de **Azure OpenAI** (o un proyecto en **Azure AI Foundry**) dentro de ese grupo.
3. En Foundry, ve a **Implementaciones / Deployments** e implementa un modelo pequeño y económico de tipo chat (elige el más barato disponible para tu cuenta). Anota el **nombre de la implementación**.
4. En el recurso, copia el **Endpoint** y una de las **Claves (Keys)**. Guárdalas en un lugar seguro temporalmente; no las pegues en el código, en el chat del taller ni en capturas de pantalla.

## Paso 3. Publica la web con Static Web Apps (30 min)

1. En el portal, crea un recurso **Static Web App** en el mismo grupo de recursos.
2. Plan: **Free**. Origen: **GitHub**, y selecciona tu repositorio y la rama `main`.
3. Detalles de compilación:
   - Preset: **Custom**
   - App location: `web`
   - Api location: `api`
   - Output location: *(vacío)*
4. Crea el recurso. Azure agrega un flujo de GitHub Actions a tu repositorio y despliega automáticamente. Puedes ver el progreso en la pestaña **Actions** de GitHub.

Al terminar, abre la URL de tu Static Web App: la tarjeta ya debe verse, pero el chat dirá que no está configurado. Es normal.

## Paso 4. Conecta la IA de forma segura (15 min)

En tu Static Web App, ve a **Configuración → Variables de entorno** (puede llamarse *Configuration / Application settings*) y agrega:

| Nombre | Valor |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | El endpoint, por ejemplo `https://mi-recurso.openai.azure.com` |
| `AZURE_OPENAI_KEY` | La clave |
| `AZURE_OPENAI_DEPLOYMENT` | El nombre de tu implementación |
| `AZURE_OPENAI_API_VERSION` | `2024-10-21` (o la versión que indique la documentación actual) |

Guarda, espera un minuto y recarga tu página. ¡Pregúntale algo a tu asistente!

## Paso 5. Experimenta (20 min)

- Cambia el `tono` en `perfil.js` (por ejemplo, "como pirata" o "muy formal"), haz *commit* y observa cómo GitHub Actions vuelve a desplegar solo.
- Intenta "romper" tu chatbot: pregúntale tu teléfono o pídele que hable de otro tema. ¿Respeta las reglas de `chat.js`? Discutan por qué ningún chatbot es 100% infalible.
- Comparte tu enlace con tus compañeros y prueben los asistentes de los demás.

## Reto opcional: tu propio dominio (tarea, fuera de la sesión)

Static Web Apps permite dominios personalizados en el plan gratuito y genera el certificado HTTPS automáticamente. Solo se paga el dominio (revisa si el GitHub Student Developer Pack ofrece uno gratis actualmente).

1. **Compra el dominio** en un registrador (Namecheap, Porkbun, Cloudflare, GoDaddy…). Activa la **protección de privacidad WHOIS** para que tu nombre, dirección y teléfono no queden públicos.
2. En tu Static Web App, ve a **Dominios personalizados → Agregar → Dominio personalizado en otro DNS**.
3. **Subdominio `www` (recomendado, el más fácil):**
   - Escribe `www.tudominio.com` en Azure.
   - En el registrador, crea un registro **CNAME**: nombre/host `www`, valor = la dirección que muestra Azure (`algo.azurestaticapps.net`).
   - Vuelve a Azure y pulsa **Validar / Agregar**.
4. **Dominio raíz (`tudominio.com`, sin www), opcional:**
   - Agrégalo en Azure; te mostrará un registro **TXT** para comprobar que el dominio es tuyo. Créalo en el registrador (host `@`).
   - Cuando Azure lo valide, crea un registro **ALIAS / ANAME / CNAME flattening** (host `@`) apuntando a la dirección de Azure. Si tu registrador no lo soporta, usa su opción de **redirección** de `tudominio.com` a `https://www.tudominio.com`.
5. **Espera.** La propagación de DNS puede tardar de minutos a varias horas. Puedes revisar el avance en sitios como dnschecker.org. Cuando Azure marque el dominio como **Listo**, el HTTPS se activa solo.

**Problemas comunes:** valor del CNAME con espacios o con `https://` (debe ser solo el nombre del host); registros duplicados para `www` en el registrador (borra el que venga por defecto); o simplemente falta tiempo de propagación.

## Paso 6. Limpieza (5 min) — ¡no te lo saltes!

Si configuraste un dominio propio y eliminas la Static Web App, borra también los registros CNAME/ALIAS del registrador para que el dominio no apunte a un recurso inexistente.

Cuando termine el taller, si no vas a conservar el proyecto, elimina el **grupo de recursos** completo para no consumir crédito. Si lo conservas, configura una **alerta de presupuesto** en *Cost Management* y considera regenerar la clave de Azure OpenAI.

---

## Probar en tu computadora (opcional, para avanzados)

Requiere Node.js 18 o superior, Azure Functions Core Tools y la CLI de Static Web Apps (`npm install -g @azure/static-web-apps-cli`).

1. Copia `api/local.settings.example.json` como `api/local.settings.json` y llena tus valores. Este archivo está en `.gitignore`: nunca lo subas a GitHub.
2. Instala dependencias: `cd api && npm install && cd ..`
3. Ejecuta: `swa start web --api-location api`
4. Abre `http://localhost:4280`.

---

## Solución de problemas

- **"No se pudo cargar el perfil":** la API no se desplegó. Revisa en GitHub Actions que el despliegue terminó sin errores y que `Api location` sea `api`.
- **"El chatbot aún no está configurado":** faltan variables de entorno o tienen otro nombre.
- **"El chatbot no pudo responder":** revisa endpoint, clave y nombre de la implementación. Si usas un modelo muy nuevo o muy antiguo, puede requerir otra `AZURE_OPENAI_API_VERSION`.
- **"Hay muchas preguntas a la vez":** se alcanzó el límite de uso del modelo; espera unos segundos.

## Notas de seguridad y costos

- La API limita el largo de los mensajes, el historial y el tamaño de cada respuesta para controlar el costo, pero no tiene límite de visitas: si compartes tu enlace públicamente, cualquiera puede usar tu crédito. Para un proyecto real convendría agregar autenticación o limitación de solicitudes.
- Azure OpenAI aplica filtros de contenido por defecto, y las reglas del asistente están en `chat.js`. Aun así, la IA puede equivocarse: por eso la página lo indica.
- Si una clave se expone por error (por ejemplo, en un commit), regénérala de inmediato en el portal.
