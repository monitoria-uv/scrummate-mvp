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

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
  systemInstruction: GEMINI_ROL,
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
