# 🧠 ScrumMate

**ScrumMate** es un asistente virtual inteligente para equipos ágiles, especializado en la metodología Scrum. Esta aplicación web facilita ceremonias, guía buenas prácticas y brinda recomendaciones contextuales a desarrolladores, Scrum Masters y Product Owners.

## Tecnologías

- Framework: [Next.js](https://nextjs.org/)
- LLM (Modelo de Lenguaje): Gemini
- Estilo: CSS global y Tailwind
- Linting & Formateo: ESLint + Prettier
- Validaciones pre-commit: Husky + Lint-Staged
- Despliegue: [Vercel](https://vercel.com/)

---

## Estructura del proyecto

```
/src
  /app         → Rutas y páginas (Next.js App Router)
  favicon.ico  → Ícono del navegador
  globals.css  → Estilos globales
  layout.tsx   → Layout raíz compartido
  page.tsx     → Página principal del MVP
.husky         → Hooks Git pre-commit
.eslint.config.mjs → Configuración de ESLint
.prettierrc    → Reglas de formateo con Prettier
```

---

## Instalación y configuración

1. Clona el repositorio:

```bash
git clone https://github.com/sebastianmr18/scrummate-mvp
cd scrummate-mvp
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta el entorno de desarrollo:

```bash
npm run dev
```

4. Verifica linting y formateo:

```bash
npm run lint
npm run format
```

---

## Validaciones con Husky

Este proyecto usa **Husky** y **Lint-Staged** para validar el código antes de cada commit.

- Se ejecutan ESLint y Prettier en los archivos modificados.
- Si se detectan errores, el commit es bloqueado hasta que se resuelvan.

No necesitas ejecutar `husky install` manualmente. Ya está configurado al clonar e instalar el proyecto.

---

## Scripts útiles

| Comando          | Descripción                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Inicia el entorno de desarrollo (Next.js)      |
| `npm run lint`   | Ejecuta ESLint para revisar errores            |
| `npm run format` | Aplica Prettier para formateo automático       |
| `npm run clean`  | Limpia archivos generados (`.next`, etc.)      |
| `npm run test`   | Placeholder para pruebas unitarias (pendiente) |
