// GET /api/perfil -> devuelve los datos públicos para pintar la tarjeta
const { app } = require("@azure/functions");
const { perfil } = require("../perfil");

app.http("perfil", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async () => {
    const { nombre, rol, frase, iniciales, intereses, enlaces, sugerencias } = perfil;
    return { jsonBody: { nombre, rol, frase, iniciales, intereses, enlaces, sugerencias } };
  }
});
