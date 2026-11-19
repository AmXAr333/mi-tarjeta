// La página NO conoce ninguna clave: solo habla con /api, que corre en Azure.
const $ = (id) => document.getElementById(id);
const historial = []; // [{ role: "user" | "assistant", content: "..." }]

// ---------- Tarjeta ----------
async function cargarPerfil() {
  try {
    const r = await fetch("/api/perfil");
    if (!r.ok) throw new Error(r.status);
    const p = await r.json();

    document.title = `${p.nombre} | Tarjeta de presentación`;
    $("nombre").textContent = p.nombre;
    $("rol").textContent = p.rol;
    $("frase").textContent = p.frase;

    $("intereses").replaceChildren(...p.intereses.map((texto) => {
      const li = document.createElement("li");
      li.textContent = texto;
      return li;
    }));

    $("enlaces").replaceChildren(...p.enlaces.map(({ texto, url }) => {
      const a = document.createElement("a");
      a.textContent = texto;
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      return a;
    }));

    $("sugerencias").replaceChildren(...(p.sugerencias || []).map((texto) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = texto;
      b.addEventListener("click", () => preguntar(texto));
      return b;
    }));

    agregarMensaje("assistant", `¡Hola! Soy el asistente de ${p.nombre.split(" ")[0]}. Pregúntame lo que quieras sobre su perfil.`, false);
  } catch {
    $("nombre").textContent = "Sin datos";
    agregarError("No se pudo cargar el perfil. Revisa que la API esté desplegada.");
  }
}

// ---------- Chat ----------
function agregarMensaje(role, texto, guardar = true) {
  const div = document.createElement("div");
  div.className = `mensaje ${role === "user" ? "mensaje--yo" : "mensaje--bot"}`;
  div.textContent = texto; // textContent evita inyectar HTML
  $("mensajes").append(div);
  if (guardar) historial.push({ role, content: texto });
  return div;
}

function agregarError(texto) {
  const div = document.createElement("div");
  div.className = "mensaje mensaje--error";
  div.textContent = texto;
  $("mensajes").append(div);
}

async function preguntar(texto) {
  texto = texto.trim();
  if (!texto) return;

  $("sugerencias").hidden = true;
  $("enviar").disabled = true;
  $("pregunta").value = "";

  agregarMensaje("user", texto);
  const espera = agregarMensaje("assistant", "Escribiendo…", false);
  espera.classList.add("escribiendo");

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensajes: historial })
    });
    const datos = await r.json().catch(() => ({}));
    espera.remove();

    if (!r.ok) {
      historial.pop(); // quita la pregunta que no tuvo respuesta
      agregarError(datos.error || "El chatbot no pudo responder. Intenta de nuevo.");
      return;
    }
    agregarMensaje("assistant", datos.respuesta);
  } catch {
    espera.remove();
    historial.pop();
    agregarError("Sin conexión con el chatbot. Revisa tu internet e intenta de nuevo.");
  } finally {
    $("enviar").disabled = false;
    $("pregunta").focus();
  }
}

$("formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  preguntar($("pregunta").value);
});

cargarPerfil();
