export const speak = (text) => {
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "es-ES";
  msg.rate = 0.9;
  window.speechSynthesis.speak(msg);
};

export const stopSpeak = () => {
  window.speechSynthesis.cancel();
};
