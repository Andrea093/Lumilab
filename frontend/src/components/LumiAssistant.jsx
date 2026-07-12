import React, { useState } from "react";
import LumiCharacter from "./LumiCharacter";
import useLumi from "../hooks/useLumi";
import { topics } from "../data/topics";

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// Palabras clave -> id de tema (data/topics.js). El orden importa: entradas mas
// especificas primero, para que "mrua" no quede atrapada por una regla generica
// de "movimiento" antes de llegar a su propia regla.
const TOPIC_KEYWORDS = [
  { id: "mrua", words: ["mrua"] },
  { id: "mru", words: ["mru"] },
  { id: "mcua", words: ["mcua", "circular acelerad", "circular con aceleracion"] },
  { id: "mcu", words: ["mcu", "circular", "gira", "giro", "rotacion"] },
  { id: "caida-libre", words: ["caida libre", "caida", "cae", "caer"] },
  { id: "ondas-sonido", words: ["onda", "sonido", "frecuencia", "amplitud", "vibracion"] },
  {
    id: "leyes-newton",
    words: ["fuerza", "newton", "inercia", "accion y reaccion", "accion reaccion"],
  },
  { id: "dinamica-newton", words: ["friccion", "dinamica", "rozamiento"] },
  { id: "trabajo-potencia", words: ["potencia"] },
  { id: "trabajo-energia-mecanica", words: ["trabajo", "energia cinetica", "energia potencial", "columpio"] },
  { id: "formas-de-energia", words: ["transformacion de energia", "energia"] },
  { id: "calor-temperatura", words: ["calor", "temperatura", "termico"] },
  { id: "estados-materia", words: ["estado de la materia", "solido", "liquido", "gas", "densidad", "materia"] },
  { id: "magnitudes-unidades", words: ["magnitud", "unidad", "medir", "medicion"] },
  { id: "movimiento-basico", words: ["movimiento", "distancia", "velocidad", "aceleracion", "rapidez"] },
  { id: "electricidad-estatica", words: ["estatica", "carga electrica", "electrizacion"] },
  { id: "electricidad-magnetismo", words: ["electricidad", "circuito", "corriente", "magnetismo", "iman"] },
  { id: "presion-fluidos", words: ["presion", "fluido", "flota", "empuje", "arquimedes", "pascal", "hidraulico"] },
  { id: "gravitacion-universal", words: ["planeta", "orbita", "satelite", "gravitacion", "universo"] },
  { id: "optica-geometrica", words: ["luz", "reflexion", "refraccion", "espejo", "lente", "optica"] },
];

// Definiciones directas para preguntas tipo "qué es X": el resumen de cada tema está
// escrito para describir la lección (qué vas a aprender ahí), no para responder la
// pregunta en sí, así que usarlo solo como respuesta del chat sonaba desviado (ej.
// "qué es la fuerza" devolvía el resumen de Leyes de Newton, que empieza hablando de
// inercia en vez de definir la fuerza).
const QUICK_DEFINITIONS = {
  mru: "El MRU es un movimiento en línea recta con velocidad constante, sin acelerar ni frenar.",
  mrua: "El MRUA es un movimiento en línea recta donde la velocidad cambia de forma constante, porque hay una aceleración constante.",
  mcu: "El MCU es un movimiento circular donde la rapidez se mantiene constante todo el tiempo.",
  mcua: "El MCUA es un movimiento circular donde la velocidad angular aumenta o disminuye de forma constante.",
  "caida-libre":
    "La caída libre es el movimiento de un objeto que cae solo por acción de la gravedad, acelerando siempre igual sin importar su masa.",
  "ondas-sonido":
    "Una onda es una forma de transportar energía que viaja sin mover materia de un lugar a otro; el sonido es un ejemplo de onda.",
  "leyes-newton":
    "La fuerza es una interacción (un empujón o un jalón) capaz de cambiar el movimiento o la forma de un objeto. Se relaciona con la masa y la aceleración mediante las leyes de Newton (F = m·a).",
  "dinamica-newton": "La fricción es una fuerza que se opone al movimiento entre dos superficies en contacto.",
  "trabajo-potencia":
    "La potencia es la rapidez con la que se realiza un trabajo o se transfiere energía: el trabajo dividido entre el tiempo que tomó hacerlo.",
  "trabajo-energia-mecanica":
    "El trabajo, en física, es la energía transferida a un objeto cuando una fuerza logra moverlo cierta distancia.",
  "formas-de-energia":
    "La energía es la capacidad de producir cambios: mover, calentar, iluminar o producir sonido, y puede transformarse de una forma a otra.",
  "calor-temperatura":
    "El calor es la energía que se transfiere de un cuerpo más caliente a uno más frío; la temperatura mide qué tan caliente o frío está algo.",
  "estados-materia":
    "La materia es todo lo que ocupa espacio y tiene masa; existe principalmente en tres estados: sólido, líquido y gas.",
  "magnitudes-unidades":
    "Una magnitud física es algo que se puede medir, como la longitud, la masa o el tiempo, usando una unidad común.",
  "movimiento-basico":
    "La velocidad es qué tan rápido se mueve algo: la distancia recorrida dividida entre el tiempo que tomó recorrerla.",
  "electricidad-estatica":
    "La electricidad estática ocurre cuando un objeto acumula carga eléctrica, generalmente por fricción entre dos materiales.",
  "electricidad-magnetismo":
    "La electricidad es el flujo de cargas eléctricas; está conectada con el magnetismo, porque una corriente eléctrica genera un campo magnético.",
  "presion-fluidos": "La presión es una fuerza aplicada sobre una superficie, dividida entre el área de esa superficie.",
  "gravitacion-universal":
    "La gravitación es la fuerza de atracción que existe entre todos los objetos con masa, y es lo que mantiene a los planetas en órbita.",
  "optica-geometrica":
    "La luz es una forma de energía que viaja en línea recta y puede reflejarse (rebotar) o refractarse (doblarse) al cambiar de medio.",
};

// Conceptos base que no son "el resumen de un tema" sino ideas transversales que un
// estudiante pregunta seguido (gravedad, masa vs. peso, qué es la física). Se revisan
// antes que los temas puntuales para responder directo, sin desviarse a una lección.
const STANDALONE_DEFINITIONS = [
  {
    words: [
      "que es lumilab",
      "para que sirve lumilab",
      "que hace lumilab",
      "que es esta pagina",
      "que es esta plataforma",
      "de que se trata",
      "que puedo hacer aqui",
    ],
    text: "Lumilab es un laboratorio de física interactivo, pensado para verse, escucharse y sentirse: tiene simuladores con sonido y vibración, lecciones por grado (6° a 11°) y a mí, para explicarte todo por voz. Puedes explorar libremente desde el Laboratorio, o seguir el orden del curso desde Temas por grado.",
  },
  {
    words: ["que es la fisica", "que es fisica", "que estudia la fisica"],
    text: "La física es la ciencia que estudia la materia, la energía, el movimiento y las fuerzas, y cómo se relacionan entre sí.",
  },
  {
    words: ["que es la ciencia"],
    text: "La ciencia es una forma de entender el mundo a través de la observación, la experimentación y la evidencia, en vez de solo suposiciones.",
  },
  {
    words: ["gravedad"],
    text: "La gravedad es la fuerza que atrae a los objetos hacia la Tierra (o entre sí, en general: todo lo que tiene masa atrae a todo lo demás). Puedes verla en acción en el simulador de Caída libre, en el Laboratorio.",
  },
  {
    words: ["que es la masa", "la masa de"],
    text: "La masa es la cantidad de materia que tiene un objeto. No cambia aunque el objeto cambie de lugar: tu masa es la misma en la Tierra que en la Luna.",
  },
  {
    words: ["que es el peso", "cuanto peso"],
    text: "El peso es la fuerza con la que la gravedad atrae a un objeto. A diferencia de la masa, el peso sí cambia según dónde estés: en la Luna pesarías menos, aunque tu masa fuera la misma.",
  },
  {
    words: ["atomo", "electron", "proton", "neutron"],
    text: "Un átomo es la unidad más pequeña de la materia que conserva las propiedades de un elemento. Tiene un núcleo con protones y neutrones, rodeado de electrones.",
  },
];

function buildTopicAnswer(topic) {
  const lead = QUICK_DEFINITIONS[topic.id] || topic.summary;
  const where =
    topic.status === "available"
      ? "Tiene simulador interactivo: lo encuentras en el Laboratorio."
      : "Puedes leer la lección completa en Temas por grado.";
  return `${lead} ${where}`;
}

export default function LumiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "lumi", text: "Hola 😊 Soy Lumi. Pregúntame sobre cualquier tema, por ejemplo 'qué es la fuerza' o 'qué es el calor'." },
  ]);
  const { speak, listen, isSpeaking, isListening } = useLumi();

  /* ---------------- RESPUESTAS ---------------- */

  const getResponse = (input) => {
    const text = normalize(input);

    if (text.includes("hola")) {
      return "Hola 💜 ¿Qué tema estás explorando?";
    }

    if (text.includes("gracias")) {
      return "¡Con gusto! 💜 Aquí estoy si necesitas algo más.";
    }

    if (text.includes("no entiendo") || text.includes("ayuda")) {
      return "No te preocupes 🌸 pregúntame por un tema, por ejemplo 'qué es la energía' o 'qué es el movimiento circular', y te explico.";
    }

    for (const entry of STANDALONE_DEFINITIONS) {
      if (entry.words.some((w) => text.includes(w))) {
        return entry.text;
      }
    }

    for (const entry of TOPIC_KEYWORDS) {
      if (entry.words.some((w) => text.includes(w))) {
        const topic = topics.find((t) => t.id === entry.id);
        if (topic) return buildTopicAnswer(topic);
      }
    }

    return "No estoy segura de haber entendido 🤔 Pregúntame por un tema (ej. 'qué es la gravedad'), o dime 'ayuda'.";
  };

  const handleSend = (text) => {
    if (!text) return;

    const response = getResponse(text);

    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "lumi", text: response },
    ]);

    speak(response);
  };

  const avatarState = isListening ? "listening" : isSpeaking ? "talking" : "idle";

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          id="lumi-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Asistente Lumi"
          className="w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-xl p-4 mb-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <LumiCharacter height={48} state={avatarState} decorative />
            <span className="font-semibold text-purple-700">
              Lumi · asistente
            </span>
          </div>

          <div
            className="h-40 overflow-y-auto space-y-2 text-sm mb-2"
            role="log"
            aria-live="polite"
            aria-label="Conversación con Lumi"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg ${
                  m.from === "lumi"
                    ? "bg-purple-100 text-purple-900"
                    : "bg-gray-100 text-right"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <label htmlFor="lumi-assistant-input" className="sr-only">
              Escribe tu mensaje para Lumi
            </label>
            <input
              id="lumi-assistant-input"
              type="text"
              placeholder="Escribe o habla…"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend(e.target.value);
                  e.target.value = "";
                }
              }}
            />

            <button
              onClick={() => listen(handleSend)}
              aria-label="Hablar con Lumi por voz"
              className="px-3 py-2 bg-purple-600 text-white rounded-lg"
            >
              <span aria-hidden="true">🎤</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="lumi-assistant-panel"
        aria-label={open ? "Cerrar asistente Lumi" : "Abrir asistente Lumi"}
        className="bg-white rounded-2xl shadow-lg border border-purple-300 px-2 pt-2 pb-1"
      >
        <LumiCharacter height={68} state={avatarState} decorative />
      </button>
    </div>
  );
}
