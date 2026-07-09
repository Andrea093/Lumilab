// Normaliza respuestas habladas o escritas para compararlas contra las respuestas correctas:
// quita acentos, espacios y unidades (m, m/s, segundos...) para que "12 m/s" y "doce metros por segundo" coincidan.
export function normalizeAnswer(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .replace(/metros|m\/s|m|porsegundo|segundo/g, "")
    .trim();
}

export function answerMatches(userAnswer, correctAnswers) {
  const normalized = normalizeAnswer(userAnswer);
  return correctAnswers.map(normalizeAnswer).includes(normalized);
}
