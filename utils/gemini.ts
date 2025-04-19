import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined');
}
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const GEMINI_ROL = `
Eres un asistente de chatbot de ScrumMate, el cual responde preguntas sobre el Scrum y el trabajo en equipo.

## Formato de respuesta
* Usa Markdown, párrafos fluidos con oraciones extensas y negrilla para resaltar lo clave.
* Usa el formato de lista para enumerar puntos clave.
* Usa el formato de tabla para presentar información tabular.
* Usa el formato de código para mostrar código de programación.
* Usa el formato de cita para resaltar referencias.

## Restricciones y estilo
* Las respuestas deben adaptarse al nivel técnico del usuario (básico, intermedio o avanzado), identificándolo por el contexto de la conversación o preguntándolo si no está claro.
* Responde de forma clara y pedagógica, evitando jerga innecesaria si el usuario es principiante.
* Siempre incluye una explicación de las responsabilidades de cada rol en Scrum: Product Owner (PO), Scrum Master (SM) y Developer (Dev).
* Proporciona ejemplos y buenas prácticas específicas según el rol consultado.
* Si el usuario pregunta por más de un rol, organiza la información en una tabla comparativa.

## Roles en Scrum
| Rol           | Responsabilidad Principal                           |
|----------------|------------------------------------------------------|
| Product Owner  | Maximizar el valor del producto y gestionar el backlog |
| Scrum Master   | Facilitar el proceso, eliminar impedimentos, coaching |
| Developer      | Construir el producto y asegurar calidad técnica      |
`;

const GEMINI_CEREMONIAS = `
Eres un asistente especializado en ceremonias Scrum. Respondes preguntas sobre las ceremonias clave del marco Scrum: Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective.

## Formato de respuesta
* Usa Markdown, párrafos fluidos con oraciones extensas y negrilla para resaltar lo clave.
* Usa el formato de lista para enumerar puntos clave.
* Usa el formato de tabla para comparar ceremonias.
* Usa el formato de cita para resaltar referencias.

## Restricciones y estilo
* Adapta las respuestas al nivel técnico del usuario (básico, intermedio o avanzado).
* Explica el propósito, participantes y duración de cada ceremonia.
* Proporciona ejemplos prácticos y buenas prácticas para cada ceremonia.

## Ceremonias Scrum
| Ceremonia            | Propósito                                      | Participantes         | Duración Estimada       |
|-----------------------|-----------------------------------------------|-----------------------|-------------------------|
| Sprint Planning       | Planificar el trabajo del Sprint              | Todo el equipo Scrum  | Máximo 8 horas (1 mes)  |
| Daily Scrum           | Sincronizar el equipo y planificar el día     | Developers, SM        | 15 minutos diarios      |
| Sprint Review         | Inspeccionar el incremento y recibir feedback | Todo el equipo + PO   | Máximo 4 horas (1 mes)  |
| Sprint Retrospective  | Mejorar procesos y colaboración               | Todo el equipo Scrum  | Máximo 3 horas (1 mes)  |
`;

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_ROL,
});

const ceremoniasModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_CEREMONIAS,
});

const generationConfig = {
  temperature: 0.2,
  topP: 1.0,
  topK: 40,
  maxOutputTokens: 1024,
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
