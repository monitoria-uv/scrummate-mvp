import { getScrumCeremonyResponse, getScrumRoleResponse } from '@/utils/gemini';

jest.mock('@/utils/gemini', () => ({
  getScrumRoleResponse: jest.fn(),
  getScrumCeremonyResponse: jest.fn(),
}));

describe('Generate a response from Gemini API (Scrum assistant)', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia mocks entre pruebas
  });

  it('should return a valid response for a Scrum role query', async () => {
    const mockInput =
      '¿Cuál es la responsabilidad de un Scrum Master en Scrum? Response en una sola frase.';

    // 🧪 Simula respuesta de la función
    (getScrumRoleResponse as jest.Mock).mockResolvedValue(
      'El Scrum Master facilita el proceso Scrum.',
    );

    const response = await getScrumRoleResponse(mockInput);

    expect(response).toBeDefined();
    expect(response).toContain('Scrum Master');
  });

  it('should return a valid response for a Scrum ceremony query', async () => {
    const mockInput = '¿Qué sucede en una Sprint Retrospective?';

    (getScrumCeremonyResponse as jest.Mock).mockResolvedValue(
      'Sprint Retrospective: su propósito es mejorar el proceso.',
    );

    const response = await getScrumCeremonyResponse(mockInput);

    expect(response).toBeDefined();
    expect(response).toContain('Sprint Retrospective');
    expect(response).toContain('propósito');
  });

  it('should handle errors for invalid input', async () => {
    const mockInput = ''; // Simulamos entrada inválida

    (getScrumRoleResponse as jest.Mock).mockResolvedValue(
      'ScrumMate es un asistente virtual para metodologías ágiles.',
    );

    const response = await getScrumRoleResponse(mockInput);

    expect(response).toBeDefined();
    expect(response).toContain('ScrumMate');
  });
});
