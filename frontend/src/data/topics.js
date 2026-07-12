// Temas de física para grados 6° a 11°, alineados a los Estándares Básicos de Competencias
// en Ciencias Naturales del MEN (Colombia), componente "Entorno físico".
//
// status: 'available'    -> tiene simulador interactivo completo (ruta propia)
//         'lesson-only'   -> tiene contenido de lección (explicación + audio + ejercicios) vía /tema/:slug
//         'coming-soon'   -> aún no tiene contenido desarrollado

export const GRADE_BANDS = [
  { id: "6-7", label: "6° y 7°" },
  { id: "8-9", label: "8° y 9°" },
  { id: "10-11", label: "10° y 11°" },
];

export const THEMES = {
  mediciones: "Mediciones y magnitudes",
  materia: "Materia y energía",
  fuerzas: "Fuerzas y movimiento",
  energia: "Trabajo y energía",
  ondas: "Ondas y sonido",
  electricidad: "Electricidad y magnetismo",
  fluidos: "Fluidos y presión",
  cinematica: "Cinemática",
  dinamica: "Dinámica",
  gravitacion: "Gravitación",
  optica: "Óptica",
  termodinamica: "Termodinámica",
};

export const topics = [
  // ---------------- 6° - 7° ----------------
  {
    id: "magnitudes-unidades",
    slug: "magnitudes-y-unidades",
    title: "Magnitudes físicas y unidades de medida",
    gradeBand: "6-7",
    grades: [6, 7],
    theme: "mediciones",
    menStandard:
      "Verifico la utilidad de las magnitudes físicas y las unidades de medida en la descripción de fenómenos naturales.",
    hasSimulator: false,
    route: null,
    summary:
      "Qué es medir, el Sistema Internacional de Unidades y por qué la ciencia necesita magnitudes comunes para comparar resultados.",
    status: "lesson-only",
  },
  {
    id: "estados-materia",
    slug: "estados-de-la-materia",
    title: "Estados de la materia y densidad",
    gradeBand: "6-7",
    grades: [6, 7],
    theme: "materia",
    menStandard:
      "Explico cambios de estado de la materia a partir del modelo de la estructura de la materia.",
    hasSimulator: false,
    route: null,
    summary:
      "Sólido, líquido y gas: qué distingue a cada estado y cómo se calcula la densidad de un objeto.",
    status: "lesson-only",
  },
  {
    id: "movimiento-basico",
    slug: "el-movimiento-en-la-vida-cotidiana",
    title: "El movimiento en la vida cotidiana",
    gradeBand: "6-7",
    grades: [6, 7],
    theme: "fuerzas",
    menStandard:
      "Identifico condiciones que influyen en los resultados de un experimento y que pueden permanecer constantes o cambiar (velocidad, distancia, tiempo).",
    hasSimulator: false,
    route: null,
    summary:
      "Distancia, tiempo y velocidad: una primera aproximación intuitiva al movimiento antes de la cinemática formal.",
    status: "lesson-only",
  },
  {
    id: "formas-de-energia",
    slug: "formas-de-energia",
    title: "Formas y transformaciones de la energía",
    gradeBand: "6-7",
    grades: [6, 7],
    theme: "materia",
    menStandard:
      "Reconozco las diferentes formas de energía y su transformación en fenómenos cotidianos.",
    hasSimulator: false,
    route: null,
    summary:
      "Energía luminosa, sonora, térmica y mecánica: cómo se transforma una en otra en objetos que usamos a diario.",
    status: "lesson-only",
  },
  {
    id: "calor-temperatura",
    slug: "calor-y-temperatura",
    title: "Calor y temperatura",
    gradeBand: "6-7",
    grades: [7],
    theme: "materia",
    menStandard:
      "Establezco relaciones entre calor y temperatura a partir de las variaciones que producen estos fenómenos.",
    hasSimulator: false,
    route: null,
    summary:
      "Por qué el calor y la temperatura no son lo mismo, y cómo se transfiere el calor entre objetos.",
    status: "lesson-only",
  },

  // ---------------- 8° - 9° ----------------
  {
    id: "leyes-newton",
    slug: "leyes-de-newton",
    title: "Leyes de Newton",
    gradeBand: "8-9",
    grades: [8, 9],
    theme: "fuerzas",
    menStandard:
      "Establezco relaciones entre fuerza, masa y aceleración en el movimiento de un cuerpo (leyes de Newton).",
    hasSimulator: false,
    route: null,
    summary:
      "Inercia, F = m·a y acción-reacción: las tres leyes que explican por qué los objetos se mueven como se mueven.",
    status: "lesson-only",
  },
  {
    id: "trabajo-energia-mecanica",
    slug: "trabajo-y-energia-mecanica",
    title: "Trabajo y energía mecánica",
    gradeBand: "8-9",
    grades: [8, 9],
    theme: "energia",
    menStandard:
      "Relaciono el trabajo mecánico y la energía cinética y potencial de un cuerpo en movimiento.",
    hasSimulator: false,
    route: null,
    summary:
      "Qué es el trabajo en física, y cómo la energía cinética y potencial se transforman entre sí (por ejemplo, en un columpio).",
    status: "lesson-only",
  },
  {
    id: "ondas-sonido",
    slug: "ondas-y-sonido",
    title: "Ondas y sonido",
    gradeBand: "8-9",
    grades: [8, 9],
    theme: "ondas",
    menStandard:
      "Explico la transmisión de la energía mediante ondas y sus propiedades (frecuencia, amplitud, longitud de onda).",
    hasSimulator: true,
    route: "/ondas",
    summary:
      "Frecuencia, amplitud y longitud de onda: escucha cómo cambia el sonido al variar la frecuencia de una onda.",
    status: "available",
  },
  {
    id: "electricidad-estatica",
    slug: "electricidad-estatica",
    title: "Electricidad estática y carga eléctrica",
    gradeBand: "8-9",
    grades: [9],
    theme: "electricidad",
    menStandard:
      "Relaciono la carga eléctrica con la estructura de la materia y explico fenómenos de electrización cotidianos.",
    hasSimulator: false,
    route: null,
    summary:
      "Por qué un globo frotado atrae papelitos: una primera aproximación a la carga eléctrica.",
    status: "lesson-only",
  },
  {
    id: "presion-fluidos",
    slug: "presion-y-fluidos",
    title: "Presión y fluidos",
    gradeBand: "8-9",
    grades: [9],
    theme: "fluidos",
    menStandard:
      "Explico el comportamiento de fluidos en movimiento y en reposo (principios de Pascal y Arquímedes).",
    hasSimulator: false,
    route: null,
    summary:
      "Por qué flotan los barcos y cómo funciona un gato hidráulico: presión, empuje y principio de Pascal.",
    status: "lesson-only",
  },

  // ---------------- 10° - 11° (cinemática, ya disponible) ----------------
  {
    id: "mru",
    slug: "mru",
    title: "Movimiento Rectilíneo Uniforme (MRU)",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "cinematica",
    menStandard:
      "Establezco relaciones entre distancia, velocidad y tiempo en el movimiento rectilíneo de un cuerpo.",
    hasSimulator: true,
    route: "/mru",
    summary: "Movimiento rectilíneo uniforme. Observa velocidad constante en acción.",
    status: "available",
  },
  {
    id: "mrua",
    slug: "mrua",
    title: "Movimiento Rectilíneo Uniformemente Acelerado (MRUA)",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "cinematica",
    menStandard:
      "Establezco relaciones entre velocidad, aceleración y tiempo en el movimiento rectilíneo de un cuerpo.",
    hasSimulator: true,
    route: "/mrua",
    summary: "Movimiento acelerado. Descubre cómo cambia la velocidad.",
    status: "available",
  },
  {
    id: "mcu",
    slug: "mcu",
    title: "Movimiento Circular Uniforme (MCU)",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "cinematica",
    menStandard:
      "Explico el movimiento circular de un cuerpo a partir de las fuerzas que actúan sobre él.",
    hasSimulator: true,
    route: "/mcu",
    summary: "Movimiento circular uniforme. Trayectorias y giros constantes.",
    status: "available",
  },
  {
    id: "mcua",
    slug: "mcua",
    title: "Movimiento Circular Uniformemente Acelerado (MCUA)",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "cinematica",
    menStandard:
      "Relaciono la velocidad angular y la aceleración angular en el movimiento circular de un cuerpo.",
    hasSimulator: true,
    route: "/mcua",
    summary: "Aceleración angular. Cuando el giro cambia con el tiempo.",
    status: "available",
  },

  // ---------------- 10° - 11° (dinámica, energía, gravitación, electromagnetismo, óptica) ----------------
  {
    id: "caida-libre",
    slug: "caida-libre",
    title: "Caída libre y gravedad",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "gravitacion",
    menStandard:
      "Establezco relaciones entre la aceleración de la gravedad y el movimiento de caída libre de los cuerpos.",
    hasSimulator: true,
    route: "/caida-libre",
    summary:
      "Un caso especial del MRUA: todos los objetos caen con la misma aceleración, sin importar su masa (sin fricción del aire).",
    status: "available",
  },
  {
    id: "dinamica-newton",
    slug: "dinamica-y-friccion",
    title: "Dinámica: fuerzas, fricción y leyes de Newton",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "dinamica",
    menStandard:
      "Explico el movimiento de un cuerpo a partir de las fuerzas que actúan sobre él, incluida la fricción.",
    hasSimulator: false,
    route: null,
    summary:
      "Por qué un objeto necesita una fuerza neta para cambiar su movimiento, y el papel de la fricción al frenarlo.",
    status: "lesson-only",
  },
  {
    id: "trabajo-potencia",
    slug: "trabajo-energia-y-potencia",
    title: "Trabajo, energía y potencia",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "energia",
    menStandard:
      "Relaciono el trabajo realizado sobre un cuerpo con los cambios en su energía y la rapidez con la que ocurren (potencia).",
    hasSimulator: false,
    route: null,
    summary:
      "El principio de conservación de la energía mecánica y qué significa la potencia como energía por unidad de tiempo.",
    status: "lesson-only",
  },
  {
    id: "gravitacion-universal",
    slug: "gravitacion-universal",
    title: "Gravitación universal",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "gravitacion",
    menStandard:
      "Explico la ley de gravitación universal y su papel en el movimiento de los planetas y satélites.",
    hasSimulator: false,
    route: null,
    summary:
      "La ley de gravitación de Newton: por qué la Luna orbita la Tierra y los planetas orbitan el Sol.",
    status: "lesson-only",
  },
  {
    id: "electricidad-magnetismo",
    slug: "electricidad-y-magnetismo",
    title: "Electricidad y magnetismo",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "electricidad",
    menStandard:
      "Explico fenómenos electromagnéticos cotidianos a partir de las cargas eléctricas y los campos magnéticos.",
    hasSimulator: false,
    route: null,
    summary:
      "Ley de Coulomb, circuitos eléctricos simples y la relación entre corriente eléctrica y campo magnético.",
    status: "lesson-only",
  },
  {
    id: "optica-geometrica",
    slug: "optica-geometrica",
    title: "Óptica: reflexión y refracción de la luz",
    gradeBand: "10-11",
    grades: [10, 11],
    theme: "optica",
    menStandard:
      "Explico el comportamiento de la luz a partir de las leyes de la reflexión y la refracción.",
    hasSimulator: false,
    route: null,
    summary:
      "Por qué vemos nuestro reflejo en un espejo y por qué un lápiz parece quebrarse dentro de un vaso con agua.",
    status: "lesson-only",
  },
];

export function getTopicsByGradeBand(gradeBandId) {
  if (!gradeBandId || gradeBandId === "all") return topics;
  return topics.filter((t) => t.gradeBand === gradeBandId);
}

export function getTopicBySlug(slug) {
  return topics.find((t) => t.slug === slug);
}
