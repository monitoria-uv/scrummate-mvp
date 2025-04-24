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

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_SCRUM_ASSISTANT,
});

const ceremoniasModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_CEREMONIAS,
});

const generationConfig = {
  temperature: 0.2,
  topP: 1.0,
  topK: 40,
  maxOutputTokens: 512,
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
