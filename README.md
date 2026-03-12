<p align="center">
    <img src="https://amica.arbius.ai/ogp.png" width="600" style="margin-bottom: 0.2;"/>
</p>

<h2 align="center">AmicaV1</h2>

<p align="center">
Форк Amica для Lex. Этот репозиторий поддерживается как собственность Lex и входит в экосистему <strong>lex-project</strong>.
</p>

## Статус форка

Этот репозиторий является рабочим форком Amica и используется как стартовая точка для `AmicaV1`.

- Апстрим: [semperai/amica](https://github.com/semperai/amica)
- Текущий владелец: Lex
- Группа проектов: `lex-project`
- Текущий фокус: стабилизировать локальную разработку, локализовать интерфейс, заменить модельный стек, усилить личность персонажа, улучшить память и подготовить публичный деплой

## Git Workflow

Для этого репозитория действует простое правило рабочего контура:

- если Lex просит "запушить на GitHub", это означает подготовить отдельную ветку, открыть `Pull Request` и прислать ссылку на PR
- в описании PR нужно кратко перечислить, что изменено и что проверено
- прямой push в `master` или `main` по умолчанию не используется

## План работ по AmicaV1

Текущий рабочий план по `AmicaV1`:

1. ✅ Добавить полноценную русскую локализацию на равных правах с остальными языками.
2. ✅ Перевести стек ассистента с OpenAI-first дефолтов на решения на базе Qwen там, где это уместно.
3. ✅ Настроить характер ассистента и убрать стандартный безопасный/цензурированный тон там, где этого требует продуктовая задача.
4. ✅ Настроить приятный и стабильный голос.
5. Развернуть проект на сервере и вывести в интернет.
6. Добавить режимы личности/агентов, например horny, business и другие.
7. Построить более сильный слой памяти, чтобы Amica вела себя как цельная развивающаяся личность.

### Текущий статус миграции модельного стека

На текущем этапе уже собран рабочий гибридный стек:

- добавлен отдельный chat provider `Alibaba Cloud`
- чат работает через `Alibaba Cloud Model Studio`
- текущая рабочая модель для локальной проверки: `qwen3.5-flash`
- vision переведен на `Alibaba Cloud` через совместимый multimodal path, рабочая модель по умолчанию `qwen3.5-plus`
- TTS переведен на отдельный backend `Alibaba Cloud` с server-side proxy, модель по умолчанию `qwen3-tts-flash`
- для TTS в настройках доступен выбор voice preset и ручной ввод `voice id`
- интеграция чата и vision идет через OpenAI-compatible path Alibaba Cloud
- для стабильности браузерные вызовы завернуты в локальные server-side proxy routes
- в настройках чата доступен переключатель `thinking mode`, по умолчанию он выключен
- после перезагрузки страницы контекст активного диалога сбрасывается
- STT осознанно оставлен на `OpenAI Whisper`, потому что на текущем этапе это лучший рабочий баланс качества и простоты интеграции

### Дорожная карта миграции на Alibaba Cloud

Дальнейший целевой план по стеку такой:

1. ✅ Перевести `chat` на Qwen через existing OpenAI-compatible path. Текущий рабочий локальный вариант: `qwen3.5-flash`, при необходимости можно переключить на `qwen3.5-plus`.
2. ✅ Перевести `vision` на `qwen3.5-plus` через тот же compatible path.
3. ✅ Отдельно оценить `Alibaba ASR` как замену `OpenAI Whisper`. По результатам текущего этапа принято решение пока оставить `OpenAI Whisper`, потому что он уже работает отлично и не является проблемной точкой по качеству или стоимости.
4. ✅ Добавить отдельный `alibaba_tts` backend с server-side proxy вместо прямого фронтового вызова.

## Что Это За Проект

Amica позволяет общаться с настраиваемыми 3D-персонажами, которые умеют вести голосовой диалог, использовать vision, выражать эмоции и работать как AI-компаньон. Этот форк сохраняет фундамент оригинального проекта и превращает его в продуктовый companion runtime для `lex-project`.

Сейчас проект объединяет следующие основные области:

- оболочка приложения на `Next.js / React / TypeScript`
- 3D-аватар через `three.js` и `@pixiv/three-vrm`
- оркестрация чата через несколько LLM-провайдеров
- TTS, STT, webcam vision и idle-поведение
- поддержку desktop-сборки через Tauri

## Локальная Разработка

### Требования

- `node@18`, установленный через Homebrew
- shell-сессия на macOS с добавленным в `PATH` `node@18`

### Проверенный Сценарий Для Моей Локальной Машины

Этот сценарий уже проверен на текущем Mac и его стоит использовать как основной после нового клонирования репозитория.

Если `node@18` еще не установлен:

```bash
brew install node@18
```

Рекомендуемая настройка shell для текущего проекта:

```bash
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
```

Проверка активного runtime:

```bash
node -v
npm -v
```

Ожидаемая версия Node: `18.x`.

Полный сценарий после нового клона:

```bash
git clone https://github.com/NeuroAlex2024/amica.git
cd amica
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
node -v
npm ci
node scripts/generate_paths.js
npm run build:workers
npx next dev
```

### Первый Запуск

```bash
npm ci
node scripts/generate_paths.js
npm run build:workers
npx next dev
```

После старта открыть:

```bash
http://localhost:3000
```

### Ежедневный Старт Во Время Отладки

Использовать этот сценарий как основной во время разработки:

```bash
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
node scripts/generate_paths.js
npm run build:workers
npx next dev
```

### Как Остановить Локальный Сервер

Если сервер запущен в текущем терминале:

```bash
Ctrl+C
```

Если нужно остановить зависший или фоновый процесс:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
kill <PID>
```

### Дежурная Памятка Для Отладки

Команды, которые стоит держать под рукой во время работы:

```bash
# проверить активные node/npm
node -v
npm -v

# проверить, отвечает ли localhost:3000
curl -I http://localhost:3000

# посмотреть, кто слушает 3000 порт
lsof -nP -iTCP:3000 -sTCP:LISTEN

# посмотреть потребление памяти и CPU у Next / node
ps -Ao pid,ppid,%cpu,%mem,rss,vsz,etime,command | rg "next dev|next-server|node .*amica|npm exec next dev"

# пересобрать сгенерированные пути
node scripts/generate_paths.js

# пересобрать worker bundle
npm run build:workers

# переустановить зависимости с нуля
rm -rf node_modules .next
npm ci
```

## Конфигурация

Основная конфигурация проекта задается через `.env.local`. Для списка доступных параметров смотри `config.ts`.

### Рекомендуемые Локальные Значения

Для текущего локально проверенного сценария:

- Chat backend: `Alibaba Cloud`
- Alibaba URL: `https://dashscope-intl.aliyuncs.com/compatible-mode`
- Alibaba Model: `qwen3.5-flash`
- Alibaba Thinking Mode: `false`
- Vision backend: `Alibaba Cloud`
- Vision URL: `https://dashscope-intl.aliyuncs.com/compatible-mode`
- Vision Model: `qwen3.5-plus`
- TTS backend: `Alibaba Cloud`
- Alibaba TTS URL: `https://dashscope-intl.aliyuncs.com`
- Alibaba TTS Model: `qwen3-tts-flash`
- Alibaba TTS Voice: `Serena` или другой voice id из настроек
- STT backend: `Whisper (OpenAI)`
- Whisper Model: `whisper-1`

### Конфигурация Alibaba Cloud

Чтобы использовать Alibaba Cloud в текущем стеке, задай следующие переменные в `.env.local`:

- `NEXT_PUBLIC_ALIBABA_URL`: базовый URL compatible-mode, для Singapore `https://dashscope-intl.aliyuncs.com/compatible-mode`
- `NEXT_PUBLIC_ALIBABA_MODEL`: модель чата, например `qwen3.5-flash`
- `NEXT_PUBLIC_ALIBABA_ENABLE_THINKING`: `true` или `false`
- `NEXT_PUBLIC_ALIBABA_USE_SERVER_KEY`: `true` если ключ должен браться только с сервера
- `NEXT_PUBLIC_VISION_ALIBABA_URL`: URL vision compatible-mode, по умолчанию `https://dashscope-intl.aliyuncs.com/compatible-mode`
- `NEXT_PUBLIC_VISION_ALIBABA_MODEL`: модель vision, по умолчанию `qwen3.5-plus`
- `NEXT_PUBLIC_VISION_ALIBABA_USE_SERVER_KEY`: `true` если vision-ключ должен браться только с сервера
- `NEXT_PUBLIC_ALIBABA_TTS_URL`: базовый URL TTS API, по умолчанию `https://dashscope-intl.aliyuncs.com`
- `NEXT_PUBLIC_ALIBABA_TTS_MODEL`: модель TTS, по умолчанию `qwen3-tts-flash`
- `NEXT_PUBLIC_ALIBABA_TTS_VOICE`: voice id, по умолчанию `Serena`
- `NEXT_PUBLIC_ALIBABA_TTS_USE_SERVER_KEY`: `true` если TTS-ключ должен браться только с сервера

Для Vercel production-сценария, где пользователи не видят ваши ключи, использовать нужно обычные server-side env vars без `NEXT_PUBLIC_`:

- `ALIBABA_APIKEY`
- `VISION_ALIBABA_APIKEY` опционально
- `ALIBABA_TTS_APIKEY` опционально

Текущая реализация использует локальные proxy routes:

- `POST /api/alibabaChat/`
- `POST /api/alibabaVision/`
- `POST /api/alibabaTTS/`

### Deploy На Vercel

Для интернет-версии, где друзья пользуются вашим деплоем, а Alibaba Cloud оплачиваете вы:

1. Запушить проект в GitHub.
2. Импортировать репозиторий в Vercel как `Next.js` project.
3. Добавить server env vars:
   - `ALIBABA_APIKEY`
   - `VISION_ALIBABA_APIKEY` опционально
   - `ALIBABA_TTS_APIKEY` опционально
4. Добавить public env vars:
   - `NEXT_PUBLIC_CHATBOT_BACKEND=alibaba`
   - `NEXT_PUBLIC_VISION_BACKEND=vision_alibaba`
   - `NEXT_PUBLIC_TTS_BACKEND=alibaba_tts`
   - `NEXT_PUBLIC_ALIBABA_USE_SERVER_KEY=true`
   - `NEXT_PUBLIC_VISION_ALIBABA_USE_SERVER_KEY=true`
   - `NEXT_PUBLIC_ALIBABA_TTS_USE_SERVER_KEY=true`
   - `NEXT_PUBLIC_ALIBABA_URL=https://dashscope-intl.aliyuncs.com/compatible-mode`
   - `NEXT_PUBLIC_ALIBABA_MODEL=qwen3.5-flash`
   - `NEXT_PUBLIC_ALIBABA_ENABLE_THINKING=false`
   - `NEXT_PUBLIC_VISION_ALIBABA_URL=https://dashscope-intl.aliyuncs.com/compatible-mode`
   - `NEXT_PUBLIC_VISION_ALIBABA_MODEL=qwen3.5-plus`
   - `NEXT_PUBLIC_ALIBABA_TTS_URL=https://dashscope-intl.aliyuncs.com`
   - `NEXT_PUBLIC_ALIBABA_TTS_MODEL=qwen3-tts-flash`
   - `NEXT_PUBLIC_ALIBABA_TTS_VOICE=Serena`
5. Задеплоить проект.

После деплоя в настройках Alibaba Cloud включенный `Use server key` означает, что реальный API key скрыт от клиента и используется только в server-side proxy route.

### Конфигурация OpenRouter

Чтобы использовать OpenRouter как чат-бэкенд, задай следующие переменные в `.env.local`:

- `NEXT_PUBLIC_OPENROUTER_APIKEY`: API key OpenRouter
- `NEXT_PUBLIC_OPENROUTER_URL`: кастомный URL OpenRouter, если нужен
- `NEXT_PUBLIC_OPENROUTER_MODEL`: модель OpenRouter по умолчанию

```bash
amica
├── .env.local
├── src
│   ├── utils
│   │   └── config.ts
```

## Desktop Приложение

Amica использует [Tauri](https://tauri.app/) для desktop-сборки.

Для локальной разработки desktop-версии:

```bash
npm run tauri dev
```

## Документация

Официальная документация апстрима:

[https://docs.heyamica.com](https://docs.heyamica.com)

Нужно учитывать, что текущий форк уже развивается в собственную сторону и локальные рабочие договоренности в этом `README` важнее, чем старые инструкции апстрима.

## История

Исторически проект начался как форк ChatVRM от Pixiv, затем развивался в публичный проект Amica, а после этого стал основой для форка Lex:

[https://pixiv.github.io/ChatVRM](https://pixiv.github.io/ChatVRM)

## Лицензия

Этот форк наследует лицензионные ограничения кода и ассетов от апстрим-компонентов.

- Основная часть оригинального проекта распространяется по MIT, см. [LICENSE](https://github.com/semperai/amica/blob/master/LICENSE).
- Ассеты, включая 3D-модели и изображения, распространяются по лицензиям их авторов.
- Все тексты, планирование, branding, operational notes и будущие изменения форка Lex относятся к рабочему контуру `lex-project`, если явно не указано иное.

## История Звезд

[![Star History](https://api.star-history.com/svg?repos=semperai/amica&type=Date)](https://star-history.com/#semperai/amica&Date)

## Участники

Исторический список контрибьюторов апстрима:

<a href="https://github.com/semperai/amica/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=semperai/amica" />
</a>
