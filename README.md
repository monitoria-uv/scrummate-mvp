# 🧠 ScrumMate

**ScrumMate** es un asistente virtual inteligente para equipos ágiles, especializado en la metodología Scrum. Esta aplicación web facilita ceremonias, guía buenas prácticas y brinda recomendaciones contextuales a desarrolladores, Scrum Masters y Product Owners.

## Tecnologías

- Framework: [Next.js](https://nextjs.org/)
- Jest (pruebas de componentes y pruebas unitarias)
- LLM (Modelo de Lenguaje): Gemini
- Estilo: CSS global y Tailwind
- Linting & Formateo: ESLint + Prettier
- Despliegue: [Render](https://render.com/)

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

3. Crea un archivo `.env`

Para poder usar **localmente** el modelo necesitas obtener una API key de Gemini. Lo puedes hacer de forma gratuita en [este enlace](https://ai.google.dev/gemini-api/docs/api-key?hl=es-419). El contenido del `.env` debería ser:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=[tu API key de Gemini]
```

Cuando subas tu proyecto clonado a un repositorio de GitHub asegúrate de añadir esta variable de entorno a secrets de GitHub Actions para el pipeline de CI.

4. Ejecuta el entorno de desarrollo:

```bash
npm run dev
```

5. Verifica linting y formateo:

```bash
npm run lint
npm run format
```

---

## Scripts útiles

| Comando          | Descripción                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Inicia el entorno de desarrollo (Next.js)      |
| `npm run lint`   | Ejecuta ESLint para revisar errores            |
| `npm run format` | Aplica Prettier para formateo automático       |
| `npm run clean`  | Limpia archivos generados (`.next`, etc.)      |
| `npm run test`   | Placeholder para pruebas unitarias             |
