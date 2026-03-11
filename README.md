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

## План работ по AmicaV1

Текущий рабочий план по `AmicaV1`:

1. Добавить полноценную русскую локализацию на равных правах с остальными языками.
2. Перевести стек ассистента с OpenAI-first дефолтов на решения на базе Qwen там, где это уместно.
3. Настроить характер ассистента и убрать стандартный безопасный/цензурированный тон там, где этого требует продуктовая задача.
4. Настроить приятный и стабильный голос.
5. Развернуть проект на сервере и вывести в интернет.
6. Добавить режимы личности/агентов, например horny, business и другие.
7. Построить более сильный слой памяти, чтобы Amica вела себя как цельная развивающаяся личность.

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

- Chat backend: `ChatGPT`
- OpenAI URL: `https://api.openai.com`
- OpenAI Model: `gpt-4o-mini`
- Vision backend: `OpenAI`
- Vision URL: `https://api.openai.com`
- Vision Model: `gpt-4.1-mini`
- TTS backend: `OpenAI TTS`
- TTS URL: `https://api.openai.com`
- TTS Model: `tts-1`

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
