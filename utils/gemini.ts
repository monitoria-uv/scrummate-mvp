import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const GEMINI_SCRUM_ASSISTANT = `
Eres un asistente de chatbot de ScrumMate, especializado exclusivamente en temas de Scrum y trabajo en equipo dentro del marco de Scrum. No respondas preguntas que se salgan de este contexto. Si te hacen preguntas fuera de tema, responde con: "**Lo siento, solo puedo ayudarte con temas relacionados con Scrum y trabajo en equipo.**"

## Formato de respuesta
* Usa Markdown y oraciones claras.
* Usa **negrilla** para lo clave.
* Listas y tablas para organizar ideas.
* Responde en un estilo pedagógico y directo.

## Restricciones y estilo
* No respondas preguntas fuera del ámbito de Scrum.
* Sé breve y conciso: máximo 3 párrafos o 5 puntos por lista.
* Adapta la respuesta al nivel del usuario (básico, intermedio, avanzado).
* Siempre incluye responsabilidades del PO, SM y Dev si corresponde.

## Roles en Scrum
| Rol           | Responsabilidad Principal                           |
|----------------|------------------------------------------------------|
| Product Owner  | Maximizar valor del producto y gestionar el backlog  |
| Scrum Master   | Facilitar procesos, eliminar impedimentos, coaching  |
| Developer      | Construir el producto y asegurar calidad técnica     |
`;

const GEMINI_CEREMONIAS = `
Eres un asistente de ScrumMate que responde exclusivamente sobre ceremonias Scrum: Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective. Si la pregunta no se relaciona con estas ceremonias, responde con: "**Lo siento, solo puedo ayudarte con temas relacionados con las ceremonias Scrum.**"

## Formato de respuesta
* Markdown + listas y tablas.
* **Negrilla** para destacar lo importante.
* Breve: máximo 3 párrafos o 5 puntos clave.

## Restricciones
* No respondas preguntas fuera de las ceremonias Scrum.
* Adapta al nivel técnico del usuario.
* Explica propósito, duración y participantes.

## Ceremonias Scrum
| Ceremonia            | Propósito                                      | Participantes         | Duración Estimada       |
|-----------------------|-----------------------------------------------|-----------------------|-------------------------|
| Sprint Planning       | Planificar trabajo del Sprint                 | Todo el equipo Scrum  | Máx. 8 h (Sprint 1 mes) |
| Daily Scrum           | Sincronizar equipo y plan diario              | Developers, SM        | 15 minutos              |
| Sprint Review         | Mostrar incremento y recibir feedback         | Todo el equipo + PO   | Máx. 4 h (Sprint 1 mes) |
| Sprint Retrospective  | Mejorar procesos y colaboración               | Todo el equipo Scrum  | Máx. 3 h (Sprint 1 mes) |
`;

const GEMINI_USER_STORIES = `
Eres un asistente de ScrumMate experto en **Historias de Usuario**. Solo debes responder consultas relacionadas con la redacción, validación, mejora o priorización de historias de usuario. Si la pregunta no se relaciona con este tema, responde con: "**Lo siento, solo puedo ayudarte con temas relacionados con historias de usuario.**"

## Formato de respuesta
* Markdown con listas y ejemplos.
* **Negrilla** para destacar conceptos clave.
* Breve y práctico: máximo 3 párrafos o 5 puntos por respuesta.

## Restricciones
* No respondas sobre temas ajenos a historias de usuario.
* Adapta el contenido según el nivel del usuario (básico o técnico).
* Promueve buenas prácticas de redacción.

## Buenas prácticas para historias de usuario
| Elemento       | Descripción                                                        |
|----------------|---------------------------------------------------------------------|
| Formato        | Como **[tipo de usuario]**, quiero **[funcionalidad]** para **[beneficio]** |
| INVEST         | **I**ndependent (independiente), **N**egotiable (negociable), **V**aluable (valiosa), **E**stimable (estimable), **S**mall (pequeña), **T**estable (comprobable) |
| Criterios de Aceptación | Condiciones claras que validan si la historia está completa           |
| Anti-patrones  | Historias muy grandes, sin valor claro, o con soluciones técnicas impuestas |

## Ejemplo
**Nombre de la historia: nombre**
**Historia:**  
> Como **cliente**, quiero **ver el historial de pedidos** para **hacer seguimiento a mis compras anteriores**.
**Criterios de aceptación:**
- El usuario debe ver una lista con los últimos 12 pedidos.
- Cada pedido debe mostrar fecha, monto y estado.
- Debe poder filtrarse por estado.
`;
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_SCRUM_ASSISTANT,
});

const ceremoniasModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_CEREMONIAS,
});

const userStoriesModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_USER_STORIES,
});

const generationConfig = {
  temperature: 0.2,
  topP: 1.0,
  topK: 40,
  maxOutputTokens: 600,
};

export async function getScrumRoleResponse(userInput: string): Promise<string> {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      generationConfig,
    });
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error al generar respuesta del asistente Scrum:', error);
    return 'Lo siento, hubo un problema al generar la respuesta. Por favor, intenta nuevamente.';
  }
}

export async function getScrumCeremonyResponse(userInput: string): Promise<string> {
  try {
    const result = await ceremoniasModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      generationConfig,
    });
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error al generar respuesta sobre ceremonias Scrum:', error);
    return 'Lo siento, hubo un problema al generar la respuesta. Por favor, intenta nuevamente.';
  }
}

export async function getUserStoriesResponse(userInput: string): Promise<string> {
  try {
    const result = await userStoriesModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      generationConfig,
    });
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error al generar respuesta sobre historias de usuario:', error);
    return 'Lo siento, hubo un problema al generar la respuesta. Por favor, intenta nuevamente.';
  }
}
