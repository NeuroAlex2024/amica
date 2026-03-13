import { handleConfig, serverConfig } from "@/features/externalAPI/externalAPI";
import {
  getLocalizedPromptDefault,
  isLocalizedPromptDefault,
  normalizeLanguage,
  type PromptConfigKey,
} from "./languageDefaults";

const envVisionSystemPrompt = process.env.NEXT_PUBLIC_VISION_SYSTEM_PROMPT;
const envSystemPrompt = process.env.NEXT_PUBLIC_SYSTEM_PROMPT;

export const defaults = {
  // AllTalk TTS specific settings
  localXTTS_url: process.env.NEXT_PUBLIC_LOCALXTTS_URL ?? 'http://127.0.0.1:7851',
  alltalk_version: process.env.NEXT_PUBLIC_ALLTALK_VERSION ?? 'v2',
  alltalk_voice: process.env.NEXT_PUBLIC_ALLTALK_VOICE ?? 'female_01.wav',
  alltalk_language: process.env.NEXT_PUBLIC_ALLTALK_LANGUAGE ?? 'en',
  alltalk_rvc_voice: process.env.NEXT_PUBLIC_ALLTALK_RVC_VOICE ?? 'Disabled',
  alltalk_rvc_pitch: process.env.NEXT_PUBLIC_ALLTALK_RVC_PITCH ?? '0',
  autosend_from_mic: 'true',
  wake_word_enabled: 'false',
  wake_word: 'Hello',
  time_before_idle_sec: '20',
  debug_gfx: 'false',
  use_webgpu: 'false',
  mtoon_debug_mode: 'none',
  mtoon_material_type: 'mtoon',
  language: process.env.NEXT_PUBLIC_LANGUAGE ?? 'en',
  show_introduction: process.env.NEXT_PUBLIC_SHOW_INTRODUCTION ?? 'true',
  show_arbius_introduction: process.env.NEXT_PUBLIC_SHOW_ARBIUS_INTRODUCTION ?? 'false',
  show_add_to_homescreen: process.env.NEXT_PUBLIC_SHOW_ADD_TO_HOMESCREEN ?? 'true',
  bg_color: process.env.NEXT_PUBLIC_BG_COLOR ?? '',
  bg_url: process.env.NEXT_PUBLIC_BG_URL ?? '/bg/bg-room2.jpg',
  vrm_url: process.env.NEXT_PUBLIC_VRM_HASH ?? '/vrm/AvatarSample_A.vrm',
  vrm_hash: '',
  vrm_save_type: 'web',
  youtube_videoid: '',
  animation_url: process.env.NEXT_PUBLIC_ANIMATION_URL ?? '/animations/idle_loop.vrma',
  animation_procedural: process.env.NEXT_PUBLIC_ANIMATION_PROCEDURAL ?? 'false',
  voice_url: process.env.NEXT_PUBLIC_VOICE_URL ?? '',
  chatbot_backend: process.env.NEXT_PUBLIC_CHATBOT_BACKEND ?? 'openai',
  arbius_llm_model_id: process.env.NEXT_PUBLIC_ARBIUS_LLM_MODEL_ID ?? 'default',
  openai_apikey: process.env.NEXT_PUBLIC_OPENAI_APIKEY ?? 'default',
  openai_url: process.env.NEXT_PUBLIC_OPENAI_URL ?? 'https://i-love-amica.com',
  openai_model: process.env.NEXT_PUBLIC_OPENAI_MODEL ?? 'mlabonne/NeuralDaredevil-8B-abliterated',
  llamacpp_url: process.env.NEXT_PUBLIC_LLAMACPP_URL ?? 'http://127.0.0.1:8080',
  llamacpp_stop_sequence: process.env.NEXT_PUBLIC_LLAMACPP_STOP_SEQUENCE ?? '(End)||[END]||Note||***||You:||User:||</s>',
  ollama_url: process.env.NEXT_PUBLIC_OLLAMA_URL ?? 'http://localhost:11434',
  ollama_model: process.env.NEXT_PUBLIC_OLLAMA_MODEL ?? 'llama2',
  koboldai_url: process.env.NEXT_PUBLIC_KOBOLDAI_URL ?? 'http://localhost:5001',
  koboldai_use_extra: process.env.NEXT_PUBLIC_KOBOLDAI_USE_EXTRA ?? 'false',
  koboldai_stop_sequence: process.env.NEXT_PUBLIC_KOBOLDAI_STOP_SEQUENCE ?? '(End)||[END]||Note||***||You:||User:||</s>',
  moshi_url: process.env.NEXT_PUBLIC_MOSHI_URL ?? 'https://runpod.proxy.net',
  openrouter_apikey: process.env.NEXT_PUBLIC_OPENROUTER_APIKEY ?? '',
  openrouter_url: process.env.NEXT_PUBLIC_OPENROUTER_URL ?? 'https://openrouter.ai/api/v1',
  openrouter_model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL ?? 'openai/gpt-3.5-turbo',
  alibaba_apikey: process.env.NEXT_PUBLIC_ALIBABA_APIKEY ?? '',
  alibaba_url: process.env.NEXT_PUBLIC_ALIBABA_URL ?? 'https://dashscope-intl.aliyuncs.com/compatible-mode',
  alibaba_model: process.env.NEXT_PUBLIC_ALIBABA_MODEL ?? 'qwen3.5-flash',
  alibaba_enable_thinking: process.env.NEXT_PUBLIC_ALIBABA_ENABLE_THINKING ?? 'false',
  alibaba_use_server_key: process.env.NEXT_PUBLIC_ALIBABA_USE_SERVER_KEY ?? 'false',
  tts_muted: 'false',
  tts_backend: process.env.NEXT_PUBLIC_TTS_BACKEND ?? 'piper',
  stt_backend: process.env.NEXT_PUBLIC_STT_BACKEND ?? 'whisper_browser',
  vision_backend: process.env.NEXT_PUBLIC_VISION_BACKEND ?? 'vision_openai',
  alibaba_stt_apikey: process.env.NEXT_PUBLIC_ALIBABA_STT_APIKEY ?? process.env.NEXT_PUBLIC_ALIBABA_APIKEY ?? '',
  alibaba_stt_url: process.env.NEXT_PUBLIC_ALIBABA_STT_URL ?? process.env.NEXT_PUBLIC_ALIBABA_URL ?? 'https://dashscope-intl.aliyuncs.com/compatible-mode',
  alibaba_stt_model: process.env.NEXT_PUBLIC_ALIBABA_STT_MODEL ?? 'qwen3-asr-flash-2026-02-10',
  alibaba_stt_use_server_key: process.env.NEXT_PUBLIC_ALIBABA_STT_USE_SERVER_KEY ?? process.env.NEXT_PUBLIC_ALIBABA_USE_SERVER_KEY ?? 'false',
  vision_system_prompt: envVisionSystemPrompt ?? getLocalizedPromptDefault('vision_system_prompt', 'en'),
  vision_openai_apikey: process.env.NEXT_PUBLIC_VISION_OPENAI_APIKEY ?? 'default',
  vision_openai_url: process.env.NEXT_PUBLIC_VISION_OPENAI_URL ?? 'https://api-01.heyamica.com',
  vision_openai_model: process.env.NEXT_PUBLIC_VISION_OPENAI_URL ?? 'gpt-4-vision-preview',
  vision_alibaba_apikey: process.env.NEXT_PUBLIC_VISION_ALIBABA_APIKEY ?? process.env.NEXT_PUBLIC_ALIBABA_APIKEY ?? '',
  vision_alibaba_url: process.env.NEXT_PUBLIC_VISION_ALIBABA_URL ?? process.env.NEXT_PUBLIC_ALIBABA_URL ?? 'https://dashscope-intl.aliyuncs.com/compatible-mode',
  vision_alibaba_model: process.env.NEXT_PUBLIC_VISION_ALIBABA_MODEL ?? 'qwen3.5-plus',
  vision_alibaba_use_server_key: process.env.NEXT_PUBLIC_VISION_ALIBABA_USE_SERVER_KEY ?? process.env.NEXT_PUBLIC_ALIBABA_USE_SERVER_KEY ?? 'false',
  vision_llamacpp_url: process.env.NEXT_PUBLIC_VISION_LLAMACPP_URL ?? 'http://127.0.0.1:8081',
  vision_ollama_url: process.env.NEXT_PUBLIC_VISION_OLLAMA_URL ?? 'http://localhost:11434',
  vision_ollama_model: process.env.NEXT_PUBLIC_VISION_OLLAMA_MODEL ?? 'llava',
  whispercpp_url: process.env.NEXT_PUBLIC_WHISPERCPP_URL ?? 'http://localhost:8080',
  openai_whisper_apikey: process.env.NEXT_PUBLIC_OPENAI_WHISPER_APIKEY ?? '',
  openai_whisper_url: process.env.NEXT_PUBLIC_OPENAI_WHISPER_URL ?? 'https://api.openai.com',
  openai_whisper_model: process.env.NEXT_PUBLIC_OPENAI_WHISPER_MODEL ?? 'whisper-1',
  openai_tts_apikey: process.env.NEXT_PUBLIC_OPENAI_TTS_APIKEY ?? '',
  openai_tts_url: process.env.NEXT_PUBLIC_OPENAI_TTS_URL ?? 'https://api.openai.com',
  openai_tts_model: process.env.NEXT_PUBLIC_OPENAI_TTS_MODEL ?? 'tts-1',
  openai_tts_voice: process.env.NEXT_PUBLIC_OPENAI_TTS_VOICE ?? 'nova',
  alibaba_tts_apikey: process.env.NEXT_PUBLIC_ALIBABA_TTS_APIKEY ?? process.env.NEXT_PUBLIC_ALIBABA_APIKEY ?? '',
  alibaba_tts_url: process.env.NEXT_PUBLIC_ALIBABA_TTS_URL ?? 'https://dashscope-intl.aliyuncs.com',
  alibaba_tts_model: process.env.NEXT_PUBLIC_ALIBABA_TTS_MODEL ?? 'qwen3-tts-flash',
  alibaba_tts_voice: process.env.NEXT_PUBLIC_ALIBABA_TTS_VOICE ?? 'Chelsie',
  alibaba_tts_use_server_key: process.env.NEXT_PUBLIC_ALIBABA_TTS_USE_SERVER_KEY ?? process.env.NEXT_PUBLIC_ALIBABA_USE_SERVER_KEY ?? 'false',
  rvc_url: process.env.NEXT_PUBLIC_RVC_URL ?? 'http://localhost:8001/voice2voice',
  rvc_enabled: process.env.NEXT_PUBLIC_RVC_ENABLED ?? 'false',
  rvc_model_name: process.env.NEXT_PUBLIC_RVC_MODEL_NAME ?? 'model_name.pth',
  rvc_f0_upkey: process.env.NEXT_PUBLIC_RVC_F0_UPKEY ?? '0',
  rvc_f0_method: process.env.NEXT_PUBLIC_RVC_METHOD ?? 'pm',
  rvc_index_path: process.env.NEXT_PUBLIC_RVC_INDEX_PATH ?? 'none',
  rvc_index_rate: process.env.NEXT_PUBLIC_RVC_INDEX_RATE ?? '0.66',
  rvc_filter_radius: process.env.NEXT_PUBLIC_RVC_FILTER_RADIUS ?? '3',
  rvc_resample_sr: process.env.NEXT_PUBLIC_RVC_RESAMPLE_SR ?? '0',
  rvc_rms_mix_rate: process.env.NEXT_PUBLIC_RVC_RMS_MIX_RATE ?? '1',
  rvc_protect: process.env.NEXT_PUBLIC_RVC_PROTECT ?? '0.33',
  coquiLocal_url: process.env.NEXT_PUBLIC_COQUILOCAL_URL ?? 'http://localhost:5002',
  coquiLocal_voiceid: process.env.NEXT_PUBLIC_COQUILOCAL_VOICEID ?? 'p240',
  kokoro_url: process.env.NEXT_PUBLIC_KOKORO_URL ?? 'http://localhost:8080',
  kokoro_voice: process.env.NEXT_PUBLIC_KOKORO_VOICE ?? 'af_bella',
  piper_url: process.env.NEXT_PUBLIC_PIPER_URL ?? 'https://i-love-amica.com:5000/tts',
  elevenlabs_apikey: process.env.NEXT_PUBLIC_ELEVENLABS_APIKEY ??'',
  elevenlabs_voiceid: process.env.NEXT_PUBLIC_ELEVENLABS_VOICEID ?? '21m00Tcm4TlvDq8ikWAM',
  elevenlabs_model: process.env.NEXT_PUBLIC_ELEVENLABS_MODEL ?? 'eleven_monolingual_v1',
  speecht5_speaker_embedding_url: process.env.NEXT_PUBLIC_SPEECHT5_SPEAKER_EMBEDDING_URL ?? '/speecht5_speaker_embeddings/cmu_us_slt_arctic-wav-arctic_a0001.bin',
  coqui_apikey: process.env.NEXT_PUBLIC_COQUI_APIKEY ?? "",
  coqui_voice_id: process.env.NEXT_PUBLIC_COQUI_VOICEID ?? "71c6c3eb-98ca-4a05-8d6b-f8c2b5f9f3a3",
  amica_life_enabled: process.env.NEXT_PUBLIC_AMICA_LIFE_ENABLED ?? 'true',
  reasoning_engine_enabled: process.env.NEXT_PUBLIC_REASONING_ENGINE_ENABLED ?? 'false',
  reasoning_engine_url: process.env.NEXT_PUBLIC_REASONING_ENGINE_URL ?? 'https://i-love-amica.com:3000/reasoning/v1/chat/completions',
  external_api_enabled: process.env.NEXT_PUBLIC_EXTERNAL_API_ENABLED ?? 'false',
  x_api_key: process.env.NEXT_PUBLIC_X_API_KEY ?? '',
  x_api_secret: process.env.NEXT_PUBLIC_X_API_SECRET ?? '',
  x_access_token: process.env.NEXT_PUBLIC_X_ACCESS_TOKEN ?? '',
  x_access_secret: process.env.NEXT_PUBLIC_X_ACCESS_SECRET ?? '',
  x_bearer_token: process.env.NEXT_PUBLIC_X_BEARER_TOKEN ?? '',
  telegram_bot_token: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN ?? '',
  min_time_interval_sec: '10',
  max_time_interval_sec: '20',
  time_to_sleep_sec: '90',
  idle_text_prompt: 'No file selected',
  name: process.env.NEXT_PUBLIC_NAME ?? 'Amica',
  system_prompt: envSystemPrompt ?? getLocalizedPromptDefault('system_prompt', 'en'),
};

export function prefixed(key: string) {
  return `chatvrm_${key}`;
}

// Ensure syncLocalStorage runs only on the server side and once
if (typeof window !== "undefined") {
  (async () => {
    await handleConfig("init");
  })();
} else {
  (async () => {
    await handleConfig("fetch");
  })();
}

export function config(key: string): string {
  if (typeof localStorage !== "undefined" && localStorage.hasOwnProperty(prefixed(key))) {
    return (<any>localStorage).getItem(prefixed(key))!;
  }

  // Fallback to serverConfig if localStorage is unavailable or missing
  if (serverConfig && serverConfig.hasOwnProperty(key)) {
    return serverConfig[key];
  }

  if (defaults.hasOwnProperty(key)) {
    return (<any>defaults)[key];
  }

  throw new Error(`config key not found: ${key}`);
}

export async function updateConfig(key: string, value: string) {
  try {
    const localKey = prefixed(key);

    // Update localStorage if available
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(localKey, value);
    }

    // Sync update to server config
    await handleConfig("update",{ key, value });

  } catch (e) {
    console.error(`Error updating config for key "${key}": ${e}`);
  }
}

function getCurrentLanguage() {
  if (typeof localStorage !== "undefined") {
    const storedLanguage = localStorage.getItem(prefixed('language'));
    if (storedLanguage) {
      return normalizeLanguage(storedLanguage);
    }
  }

  if (serverConfig.language) {
    return normalizeLanguage(serverConfig.language);
  }

  return normalizeLanguage(defaults.language);
}

export function defaultConfig(key: string, language = getCurrentLanguage()): string {
  if (key === 'system_prompt') {
    return envSystemPrompt ?? getLocalizedPromptDefault('system_prompt', language);
  }

  if (key === 'vision_system_prompt') {
    return envVisionSystemPrompt ?? getLocalizedPromptDefault('vision_system_prompt', language);
  }

  if (defaults.hasOwnProperty(key)) {
    return (<any>defaults)[key];
  }

  throw new Error(`config key not found: ${key}`);
}

export function isDefaultConfigValue(key: string, value: string) {
  if (key === 'system_prompt') {
    return envSystemPrompt ? value === envSystemPrompt : isLocalizedPromptDefault('system_prompt', value);
  }

  if (key === 'vision_system_prompt') {
    return envVisionSystemPrompt
      ? value === envVisionSystemPrompt
      : isLocalizedPromptDefault('vision_system_prompt', value);
  }

  return defaultConfig(key) === value;
}

export async function syncLanguageConfig(language: string) {
  const normalizedLanguage = normalizeLanguage(language);
  const currentLanguage = normalizeLanguage(config('language'));
  const currentSystemPrompt = config('system_prompt');
  const currentVisionSystemPrompt = config('vision_system_prompt');

  const updates: Partial<Record<'language' | PromptConfigKey, string>> = {};

  if (currentLanguage !== normalizedLanguage) {
    updates.language = normalizedLanguage;
  }

  const localizedSystemPrompt = defaultConfig('system_prompt', normalizedLanguage);
  if (
    isDefaultConfigValue('system_prompt', currentSystemPrompt) &&
    currentSystemPrompt !== localizedSystemPrompt
  ) {
    updates.system_prompt = localizedSystemPrompt;
  }

  const localizedVisionPrompt = defaultConfig('vision_system_prompt', normalizedLanguage);
  if (
    isDefaultConfigValue('vision_system_prompt', currentVisionSystemPrompt) &&
    currentVisionSystemPrompt !== localizedVisionPrompt
  ) {
    updates.vision_system_prompt = localizedVisionPrompt;
  }

  for (const [key, value] of Object.entries(updates)) {
    await updateConfig(key, value);
  }

  return {
    language: normalizedLanguage,
    systemPrompt: updates.system_prompt ?? currentSystemPrompt,
    visionSystemPrompt: updates.vision_system_prompt ?? currentVisionSystemPrompt,
    updatedKeys: Object.keys(updates),
  };
}

export async function resetConfig() {
  for (const [key, value] of Object.entries(defaults)) {
    await updateConfig(key, value);
  }
}
