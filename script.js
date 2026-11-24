const sourceTextEl = document.getElementById("sourceText");
const targetTextEl = document.getElementById("targetText");
const sourceLangEl = document.getElementById("sourceLang");
const targetLangEl = document.getElementById("targetLang");
const statusEl = document.getElementById("status");

const recognitionLanguageCodes = {
  en: "en-IN", es: "es-ES", fr: "fr-FR", de: "de-DE", it: "it-IT",
  ja: "ja-JP", ko: "ko-KR", zh: "zh-CN", hi: "hi-IN", ta: "ta-IN",
  te: "te-IN", kn: "kn-IN", ml: "ml-IN", ru: "ru-RU", ar: "ar-SA",
  pt: "pt-PT", tr: "tr-TR", nl: "nl-NL", sv: "sv-SE", pl: "pl-PL",
  th: "th-TH", vi: "vi-VN", el: "el-GR", he: "he-IL"
};

function setStatus(message) {
  statusEl.textContent = message;
}

async function translateText() {
  const text = sourceTextEl.value.trim();
  const sourceLang = sourceLangEl.value;
  const targetLang = targetLangEl.value;

  if (!text) {
    setStatus("Please enter text to translate.");
    sourceTextEl.focus();
    return;
  }
  if (sourceLang === targetLang) {
    targetTextEl.value = text;
    setStatus("Source and target languages are the same.");
    return;
  }

  setStatus("Translating...");
  targetTextEl.value = "";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    if (!translated) throw new Error("Translation was not returned.");

    // Decode HTML entities that may be included in the API response.
    const decoder = document.createElement("textarea");
    decoder.innerHTML = translated;
    targetTextEl.value = decoder.value;
    setStatus("Translation completed.");
  } catch (error) {
    console.error("Translation error:", error);
    targetTextEl.value = "";
    setStatus("Translation failed. Check your internet connection and try again.");
  }
}

function switchLanguages() {
  [sourceLangEl.value, targetLangEl.value] = [targetLangEl.value, sourceLangEl.value];
  [sourceTextEl.value, targetTextEl.value] = [targetTextEl.value, sourceTextEl.value];
  setStatus("Languages switched.");
}

let recognition = null;
let isListening = false;
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

function initializeSpeechRecognition() {
  const button = document.getElementById("speechBtn");
  if (!SpeechRecognitionAPI) {
    button.disabled = true;
    button.title = "Speech recognition is not supported in this browser.";
    setStatus("Speech-to-text is not supported in this browser. Try Chrome.");
    return;
  }

  recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    button.classList.add("listening");
    button.textContent = "🎤 Listening...";
    setStatus("Listening. Speak now.");
  };

  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    sourceTextEl.value = `${sourceTextEl.value} ${transcript}`.trim();
    setStatus("Speech converted to text.");
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    setStatus(`Speech recognition error: ${event.error}`);
  };

  recognition.onend = () => {
    isListening = false;
    button.classList.remove("listening");
    button.textContent = "🎤 Speak to Type";
  };
}

function startSpeechRecognition() {
  if (!recognition) {
    setStatus("Speech recognition is unavailable in this browser.");
    return;
  }
  if (isListening) {
    recognition.stop();
    return;
  }

  recognition.lang = recognitionLanguageCodes[sourceLangEl.value] || sourceLangEl.value;
  try {
    recognition.start();
  } catch (error) {
    console.error("Could not start speech recognition:", error);
    setStatus("Could not start microphone. Check browser microphone permission.");
  }
}

function speakText(type) {
  const text = type === "source" ? sourceTextEl.value.trim() : targetTextEl.value.trim();
  const lang = type === "source" ? sourceLangEl.value : targetLangEl.value;

  if (!text) {
    setStatus("There is no text to speak.");
    return;
  }
  if (!("speechSynthesis" in window)) {
    setStatus("Text-to-speech is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = recognitionLanguageCodes[lang] || lang;

  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase() === utterance.lang.toLowerCase())
    || voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));

  if (voice) utterance.voice = voice;
  utterance.onerror = () => setStatus("Unable to play speech for this language on this device.");
  window.speechSynthesis.speak(utterance);
  setStatus("Playing speech.");
}

document.getElementById("translateBtn").addEventListener("click", translateText);
document.getElementById("switchBtn").addEventListener("click", switchLanguages);
document.getElementById("speechBtn").addEventListener("click", startSpeechRecognition);
document.getElementById("speakSourceBtn").addEventListener("click", () => speakText("source"));
document.getElementById("speakTargetBtn").addEventListener("click", () => speakText("target"));

initializeSpeechRecognition();
