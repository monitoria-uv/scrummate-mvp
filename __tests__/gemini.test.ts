import { getScrumCeremonyResponse, getScrumRoleResponse } from '@/utils/gemini';

describe('Generate a response from Gemini API (Scrum assistant)', () => {
  it('should return a valid response for a Scrum role query', async () => {
    const mockInput =
      '¿Cuál es la responsabilidad de un Scrum Master en Scrum? Response en una sola frase.';
    const response = await getScrumRoleResponse(mockInput);

    expect(response).toBeDefined();
    expect(response).toContain('Scrum Master');
  });

  it('should return a valid response for a Scrum ceremony query', async () => {
    const mockInput = '¿Qué sucede en una Sprint Retrospective?';
    const response = await getScrumCeremonyResponse(mockInput);

    expect(response).toBeDefined();
    expect(response).toContain('Sprint Retrospective');
    expect(response).toContain('propósito');
  });

  it('should handle errors for invalid input', async () => {
    const mockInput = ''; // Simulating invalid input
    const response = await getScrumRoleResponse(mockInput);

    expect(response).toBeDefined();
    expect(response).toContain('ScrumMate');
  });
});
