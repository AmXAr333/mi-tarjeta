// =====================================================================
//  ✏️  EDITA ESTE ARCHIVO CON TUS DATOS
//  Todo lo que pongas aquí es PÚBLICO: aparece en tu tarjeta y el
//  chatbot lo usará para responder. No incluyas teléfono, dirección,
//  correo personal ni ningún dato sensible.
// =====================================================================

const perfil = {
  nombre: "Amanda Aragon",
  rol: "Estudiante de Ciencias de la Informática",
  frase: "Me gusta entender cómo funcionan las cosas… y luego romperlas un poco.",
  iniciales: "AA",

  intereses: ["Infrestructura de Software", "Ciberseguridad", "Cloud", "Orcas"],

  enlaces: [
    { texto: "GitHub", url: "https://github.com/AmXAr333" },
    { texto: "LinkedIn", url: "https://www.linkedin.com/in/amanda-aragon-45b875199/" }
  ],

  // Información extra que SOLO usa el chatbot para conversar.
  sobreMi: `
    Estudio el   octavo semestre de la Licenciatura en Ciencias de la Informática.
    Mi lenguaje favorito es Python y estoy aprendiendo C#.
    Mi proyecto más reciente es una web para conocer más sobre las Orcas.
    Los fines de semana salgo a tomar en la ciudad.
    Quiero trabajar en desarrollo de software en la nube.
    Mi comida favorita son los tacos al pastor.
  `,

  // Personalidad del chatbot
  tono: "amigable, entusiasta y breve, con un toque de humor",

  // Preguntas sugeridas que aparecen como botones en el chat
  sugerencias: ["¿Qué estudia?", "¿En qué proyecto trabaja?", "¿Qué hace en su tiempo libre?"]
};

module.exports = { perfil };
