Here is a simple `README.md` for your Next.js + TypeScript project with internationalization and Redux store.

---

# Anarchy Codex Client

A multilingual web client built with Next.js, TypeScript, and Redux Toolkit.

## Features

- Next.js 14 app directory
- TypeScript support
- Internationalization with `next-intl`
- Redux Toolkit for state management
- Modular component structure
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

- `src/app/` — Application pages and layouts
- `src/components/` — Reusable UI components
- `src/i18n/` — Internationalization helpers and configs
- `src/store/` — Redux store and slices
- `public/locales/` — Translation files (`en.json`, `ru.json`, `ua.json`)
- `public/` — Static assets

## Internationalization

Translations are stored in `public/locales/`. Add or update keys in the respective language files.

## License

MIT

---
