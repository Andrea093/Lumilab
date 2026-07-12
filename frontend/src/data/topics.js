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
    content: [
      "Medir es comparar algo que no conocemos con una unidad que sí conocemos. Cuando dices que tu escritorio mide 80 centímetros, en realidad estás comparando el largo del escritorio con la unidad centímetro, repetida 80 veces.",
      "No todas las magnitudes se miden igual: la longitud, la masa, el tiempo, la temperatura y la rapidez son ejemplos de magnitudes físicas, cada una con sus propias unidades (metros, kilogramos, segundos, grados Celsius, metros por segundo).",
      "El Sistema Internacional de Unidades (SI) existe porque la ciencia necesita que todo el mundo, sin importar el país, hable el mismo idioma de medidas. Si alguien mide algo en metros en Japón y otra persona también usa metros en Colombia, pueden comparar sus resultados sin confusión.",
    ],
    connection:
      "Ya mides cosas todos los días sin llamarlo física: cuando revisas cuánto falta para que termine la clase (tiempo), cuánto pesa tu mochila (masa) o qué tan lejos vives del colegio (longitud). La física solo le pone nombre y precisión a algo que ya sabes hacer.",
    reflectionQuestion:
      "Piensa en tu rutina de esta mañana: ¿qué tres cosas mediste, aunque no te dieras cuenta, y con qué unidad las medirías?",
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
    content: [
      "La materia que nos rodea existe principalmente en tres estados: sólido, líquido y gas. Lo que distingue a cada uno es qué tan libres están sus partículas para moverse: en un sólido están muy juntas y casi no se mueven, en un líquido se deslizan unas sobre otras, y en un gas se mueven libremente y muy separadas.",
      "El agua es el ejemplo perfecto para entenderlo: como hielo es sólida, como agua líquida fluye, y como vapor se dispersa por el aire. Es la misma sustancia, solo cambia la energía y el movimiento de sus partículas.",
      "La densidad explica por qué un aceite flota sobre el agua o por qué una piedra se hunde: es la relación entre cuánta masa tiene un objeto y cuánto espacio (volumen) ocupa. Un objeto más denso que el agua se hunde; uno menos denso, flota.",
    ],
    connection:
      "Ya conoces los cambios de estado aunque no los llames así: el hielo que se derrite en tu vaso, el vapor que sale de una olla hirviendo, o el rocío que se forma en la mañana sobre el pasto. Todo eso es materia cambiando de estado.",
    reflectionQuestion:
      "¿Recuerdas alguna vez que hayas visto la misma sustancia en dos estados diferentes (por ejemplo, hielo y agua)? Cuéntalo con tus palabras.",
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
    content: [
      "Antes de estudiar fórmulas, el movimiento se puede entender con tres preguntas simples: ¿qué tan lejos se movió algo (distancia)?, ¿cuánto tiempo tardó (tiempo)?, y ¿qué tan rápido iba (velocidad)? Estas tres ideas están conectadas: la velocidad es, básicamente, la distancia recorrida dividida entre el tiempo que tomó recorrerla.",
      "En un experimento, algunas condiciones se mantienen iguales (constantes) y otras cambian (variables). Por ejemplo, si caminas siempre al mismo paso, tu velocidad es constante; si empiezas a correr, tu velocidad cambió.",
      "Observar estas condiciones con cuidado —qué cambió y qué se mantuvo igual— es el primer paso del pensamiento científico, mucho antes de necesitar una sola ecuación.",
    ],
    connection:
      "Cuando comparas quién llega más rápido a la tienda de la esquina, o calculas si te va a dar tiempo de llegar al colegio caminando, ya estás razonando sobre distancia, tiempo y velocidad, exactamente como lo hace un físico.",
    reflectionQuestion:
      "La próxima vez que camines a algún lugar conocido, fíjate: ¿tu velocidad se mantuvo constante o cambió en el camino? ¿Por qué?",
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
    content: [
      "La energía no se ve directamente, pero se reconoce por lo que hace: mueve cosas, calienta, ilumina, produce sonido. Existen varias formas de energía: mecánica (movimiento y posición), térmica (calor), luminosa (luz), sonora (sonido) y eléctrica, entre otras.",
      "Una idea clave de la física es que la energía no se crea ni se destruye, solo se transforma de una forma a otra. Un bombillo transforma energía eléctrica en luz y también en calor; una guitarra transforma el movimiento de tu mano en energía sonora.",
      "Estas transformaciones están sucediendo constantemente a tu alrededor, aunque casi nunca nos detenemos a identificarlas una por una.",
    ],
    connection:
      "Cuando conectas un cargador, prendes una lámpara o escuchas música, estás presenciando transformaciones de energía. Reconocerlas en objetos cotidianos es exactamente lo que hace un científico cuando estudia la energía.",
    reflectionQuestion:
      "Elige un objeto que uses todos los días (un celular, una licuadora, una bicicleta) y describe qué transformación de energía ocurre cuando lo usas.",
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
    content: [
      "Aunque se usan como sinónimos en el lenguaje diario, calor y temperatura son conceptos distintos en física. La temperatura mide qué tan caliente o frío está algo; el calor es la energía que se transfiere de un cuerpo más caliente a uno más frío.",
      "El calor siempre viaja en una dirección: del objeto más caliente al más frío, nunca al revés por sí solo. Por eso una bebida fría se calienta con el tiempo si la dejas afuera, y una sopa caliente se enfría.",
      "Dos objetos pueden tener temperaturas distintas pero, dado suficiente tiempo en contacto, tienden a llegar a la misma temperatura: eso se llama equilibrio térmico.",
    ],
    connection:
      "Cuando tocas una olla y sientes que 'quema', en realidad estás sintiendo el calor pasando de la olla (más caliente) a tu mano (más fría). Ese mismo principio explica por qué un helado se derrite en tu mano y por qué una bebida caliente se enfría si no la tomas rápido.",
    reflectionQuestion:
      "Cuenta una situación reciente en la que hayas sentido el calor pasar de un objeto caliente a uno frío (o al revés). ¿Qué objetos eran?",
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
    content: [
      "La primera ley de Newton, o ley de la inercia, dice que un objeto en reposo permanece en reposo, y uno en movimiento sigue moviéndose en línea recta a velocidad constante, a menos que una fuerza actúe sobre él. Los objetos no cambian su estado de movimiento por sí solos.",
      "La segunda ley conecta fuerza, masa y aceleración con la ecuación F = m·a: a más fuerza aplicada, mayor aceleración; a mayor masa, más difícil es acelerar el objeto con la misma fuerza. Por eso cuesta más empujar un carro que empujar una bicicleta.",
      "La tercera ley dice que a toda fuerza (acción) le corresponde otra fuerza igual y de sentido contrario (reacción). Cuando saltas, empujas el suelo hacia abajo, y el suelo te empuja a ti hacia arriba con la misma fuerza.",
    ],
    connection:
      "Cuando frenas de golpe en un bus y tu cuerpo sigue moviéndose hacia adelante, esa es la primera ley de Newton actuando sobre ti. Cuando pateas un balón, la fuerza que le imprimes lo acelera según su masa (segunda ley), y cuando nadas empujando el agua hacia atrás, el agua te empuja a ti hacia adelante (tercera ley).",
    reflectionQuestion:
      "Piensa en un momento en que sentiste tu cuerpo 'seguir moviéndose' cuando algo frenó de repente (un bus, un carro). ¿Qué ley de Newton explica lo que sentiste?",
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
    content: [
      "En física, 'trabajo' tiene un significado preciso: se hace trabajo sobre un objeto cuando una fuerza logra moverlo una cierta distancia en la dirección de la fuerza. Si empujas una pared y no se mueve, técnicamente no hiciste trabajo físico, aunque te hayas cansado.",
      "La energía cinética es la energía que tiene un objeto por estar en movimiento; la energía potencial es la energía que tiene por su posición, por ejemplo, la altura desde la que puede caer.",
      "En un columpio, la energía se transforma constantemente entre potencial y cinética: en el punto más alto tienes más energía potencial y menos cinética, y en el punto más bajo ocurre lo contrario. La energía mecánica total (la suma de ambas) se mantiene aproximadamente constante.",
    ],
    connection:
      "Cuando subes en bicicleta a un punto alto y luego bajas sin pedalear ganando velocidad, estás viviendo la transformación de energía potencial en energía cinética. Un columpio, un tobogán o una montaña rusa funcionan con el mismo principio.",
    reflectionQuestion:
      "Describe un momento en el que hayas sentido esa transformación de energía (subiendo y luego bajando rápido): ¿en qué actividad fue?",
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
    content: [
      "Toda la materia está hecha de átomos, y los átomos tienen partículas con carga eléctrica: los protones (carga positiva) y los electrones (carga negativa). Normalmente un objeto tiene la misma cantidad de cargas positivas y negativas, por lo que es neutro.",
      "Cuando frotas dos materiales (como un globo contra tu cabello), algunos electrones se transfieren de un material al otro. El material que gana electrones queda cargado negativamente, y el que los pierde queda cargado positivamente.",
      "Las cargas del mismo signo se repelen, y las de signo contrario se atraen. Por eso un globo cargado negativamente puede atraer pedacitos de papel neutros: induce una separación de cargas en el papel y termina atrayéndolo.",
    ],
    connection:
      "Ese pequeño 'chispazo' que a veces sientes al tocar una perilla metálica después de caminar sobre una alfombra, o cuando tu cabello se levanta al quitarte un suéter de lana, son electricidad estática en acción: cargas que se acumularon y se mueven de golpe.",
    reflectionQuestion:
      "¿Alguna vez sentiste una pequeña descarga estática o viste tu cabello 'pegarse' a algo? Cuenta qué pasó, con tus palabras.",
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
    content: [
      "La presión es la fuerza que se aplica sobre una superficie, dividida entre el área de esa superficie. La misma fuerza aplicada sobre un área más pequeña genera más presión: por eso un tacón de aguja presiona más el piso que un zapato plano, aunque la persona pese lo mismo.",
      "El principio de Pascal dice que la presión aplicada a un fluido (líquido o gas) encerrado se transmite igual a todos los puntos del fluido. Este principio es la base de los gatos hidráulicos, que permiten levantar un carro con relativamente poca fuerza.",
      "El principio de Arquímedes explica por qué flotan los objetos: todo cuerpo sumergido en un fluido recibe un empuje hacia arriba igual al peso del fluido que desplaza. Si ese empuje es mayor que el peso del objeto, flota; si es menor, se hunde.",
    ],
    connection:
      "Un barco de acero flota, aunque el acero sea más denso que el agua, porque su forma hueca desplaza mucha agua y genera un empuje grande (Arquímedes). Y cuando usas una jeringa o ves un gato hidráulico levantando un carro, estás viendo el principio de Pascal.",
    reflectionQuestion:
      "¿Por qué crees que un barco de metal flota, pero una moneda de metal se hunde? Explícalo con tus palabras.",
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
    content: [
      "Para que un objeto cambie su movimiento, necesita una fuerza neta distinta de cero actuando sobre él. Si varias fuerzas actúan sobre un objeto y se cancelan entre sí, el objeto se comporta como si no hubiera ninguna fuerza: sigue en reposo o a velocidad constante.",
      "La fricción es una fuerza que se opone al movimiento relativo entre dos superficies en contacto. Depende de qué tan ásperas sean las superficies y de qué tanto se presionan entre sí. Sin fricción, no podrías caminar (tus pies resbalarían) ni un carro podría frenar.",
      "En problemas reales, casi siempre hay que sumar varias fuerzas —peso, fricción, la fuerza aplicada— para encontrar la fuerza neta y, con la segunda ley de Newton, predecir cómo se moverá un objeto.",
    ],
    connection:
      "Cuando caminas sobre hielo y resbalas, estás sintiendo la falta de fricción. Cuando frenas una bicicleta, la fricción entre las llantas y el piso —y entre los frenos y la rueda— es justamente lo que te permite detenerte.",
    reflectionQuestion:
      "Piensa en una superficie muy resbalosa que hayas pisado (hielo, piso mojado, cerámica con jabón). ¿Cómo cambió tu forma de caminar por la falta de fricción?",
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
    content: [
      "La ley de conservación de la energía mecánica dice que, si no hay fricción ni otras fuerzas que disipen energía, la suma de energía cinética y potencial de un objeto se mantiene constante durante su movimiento, aunque una se transforme en la otra.",
      "La potencia mide qué tan rápido se realiza un trabajo o se transfiere energía: es el trabajo dividido entre el tiempo que tomó hacerlo. Dos personas pueden hacer el mismo trabajo (subir la misma caja a la misma altura), pero la que lo hace más rápido desarrolla más potencia.",
      "Por eso un motor más potente no necesariamente hace 'más' trabajo que uno menos potente, sino que puede hacer el mismo trabajo en menos tiempo.",
    ],
    connection:
      "Subir corriendo unas escaleras requiere más potencia que subirlas caminando lento, aunque el trabajo total (tu peso por la altura que subiste) sea el mismo en ambos casos. Por eso terminas más agitado al subir corriendo: tu cuerpo entregó la misma energía en menos tiempo.",
    reflectionQuestion:
      "Compara subir una escalera corriendo y subirla caminando: ¿en cuál caso crees que desarrollas más potencia, y por qué?",
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
    content: [
      "Newton propuso que todos los objetos con masa se atraen entre sí con una fuerza gravitacional. Esta fuerza es más grande cuanto mayor es la masa de los objetos, y más pequeña cuanto mayor es la distancia entre ellos.",
      "La gravedad de la Tierra es la que te mantiene en el suelo y hace caer los objetos; la gravedad del Sol es la que mantiene a la Tierra y a los demás planetas en órbita a su alrededor, en vez de salir disparados al espacio.",
      "La Luna no 'cae' sobre la Tierra ni se escapa al espacio porque está en un equilibrio constante: la gravedad la atrae hacia la Tierra, pero su velocidad la mantiene en una trayectoria curva alrededor de nuestro planeta. Eso es, exactamente, una órbita.",
    ],
    connection:
      "La misma fuerza que hace caer una fruta de un árbol es la que mantiene a la Luna orbitando la Tierra, y a la Tierra orbitando el Sol: una sola ley explica fenómenos que parecen completamente distintos, desde una fruta cayendo hasta el movimiento de los planetas.",
    reflectionQuestion:
      "¿Por qué crees que la Luna no se cae sobre la Tierra, si la gravedad la está atrayendo constantemente?",
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
    content: [
      "La ley de Coulomb describe la fuerza entre dos cargas eléctricas: cargas del mismo signo se repelen y de signo contrario se atraen, con una fuerza que depende de qué tan grandes son las cargas y qué tan separadas están.",
      "Un circuito eléctrico simple necesita una fuente de energía (como una pila), un conductor (cable) por donde fluyan las cargas, y una carga (como un bombillo) que use esa energía. La corriente eléctrica es, básicamente, el flujo ordenado de cargas eléctricas a través del circuito.",
      "La electricidad y el magnetismo están profundamente conectados: una corriente eléctrica genera un campo magnético a su alrededor, y un campo magnético que cambia puede generar una corriente eléctrica. Este principio es la base de motores, generadores y transformadores.",
    ],
    connection:
      "Cada vez que prendes un aparato con pilas, estás cerrando un circuito eléctrico simple. Y el hecho de que la electricidad y el magnetismo estén conectados es lo que permite que un motor eléctrico —el de un ventilador, por ejemplo— convierta electricidad en movimiento giratorio.",
    reflectionQuestion:
      "Piensa en un aparato eléctrico que uses seguido: ¿puedes identificar la fuente de energía, el conductor y la carga (lo que usa la energía) en él?",
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
    content: [
      "La reflexión ocurre cuando la luz rebota en una superficie, como un espejo. El ángulo con el que la luz llega (ángulo de incidencia) es igual al ángulo con el que rebota (ángulo de reflexión): por eso puedes predecir exactamente dónde verás un reflejo.",
      "La refracción ocurre cuando la luz pasa de un medio a otro (por ejemplo, del aire al agua) y cambia de velocidad, lo que hace que también cambie de dirección: se 'dobla'. Por eso un lápiz metido en un vaso con agua parece quebrado en la superficie.",
      "Estos dos fenómenos —reflexión y refracción— explican desde por qué vemos nuestra imagen en un espejo hasta por qué los lentes (de gafas, cámaras o microscopios) pueden enfocar la luz para formar imágenes.",
    ],
    connection:
      "Cuando te miras en un espejo, ves reflexión. Cuando metes un pitillo en un vaso con agua y parece quebrado o desplazado en la superficie, estás viendo refracción. Ambos fenómenos los has visto muchas veces sin ponerles nombre.",
    reflectionQuestion:
      "¿Has notado alguna vez que un objeto se ve 'quebrado' o desplazado al meterlo parcialmente en agua? Describe qué viste.",
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
