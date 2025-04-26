import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScrumAssistantChatWindow } from '@/components/ui/features/scrum-assistant/scrumAssistantChatWindow';
import { getMessagesByChatId, addMessage } from '@/db/db';
import { getScrumRoleResponse } from '@/utils/gemini';
import { Message } from '@/types/message';

// Mock de las funciones de la base de datos y la API
jest.mock('@/db/db', () => ({
  getMessagesByChatId: jest.fn(),
  addMessage: jest.fn(),
}));

jest.mock('@/utils/gemini', () => ({
  getScrumRoleResponse: jest.fn(),
}));

jest.mock('react-markdown', () => (props: any) => {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
});

class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

const mockMessages = [
  {
    id: '1',
    chat_id: 'test-chat',
    sender: 'assistant',
    text: 'Hola!',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    chat_id: 'test-chat',
    sender: 'user',
    text: 'Cómo estás?',
    timestamp: new Date().toISOString(),
  },
];

describe('<ScrumAssistantChatWindow />', () => {
  const chatId = 'test-chat';

  beforeEach(() => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue(mockMessages);
    (addMessage as jest.Mock).mockResolvedValue(undefined);
    (getScrumRoleResponse as jest.Mock).mockResolvedValue('Bien, gracias!');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('se monta correctamente y muestra el mensaje de inicio si no hay mensajes', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(
        /🧠 Escribe algo para empezar tu conversación con el asistente Scrum./i,
      ),
    ).toBeInTheDocument();
  });

  it('se monta correctamente y muestra los mensajes existentes', async () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(screen.getByText('Hola!')).toBeInTheDocument();
      expect(screen.getByText('Cómo estás?')).toBeInTheDocument();
    });
  });

  // Actualizar el test para no depender de data-testid
  it('pasa el chatId a ChatWindow y fetchMessages', async () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);

    await waitFor(() => {
      expect(getMessagesByChatId).toHaveBeenCalledWith(chatId);
    });

    // Verificar que el chatId se pasa correctamente verificando el comportamiento
    expect(addMessage).not.toHaveBeenCalled(); // Estado inicial
  });
  it('permite al usuario escribir un mensaje', () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'Hola asistente' } });
    expect((inputElement as HTMLInputElement).value).toBe('Hola asistente');
  });

  it('llama a onSendMessage y actualiza la lista de mensajes al enviar un mensaje', async () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);

    // Usar un selector más flexible para el input
    const inputElement = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Enviar/i });

    fireEvent.change(inputElement, { target: { value: 'Hola asistente' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledTimes(2);
    });
  });

  it('no hace nada si se intenta enviar un mensaje vacío', () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);
    expect(addMessage).not.toHaveBeenCalled();
  });

  it('muestra el mensaje vacío si la carga inicial de mensajes devuelve un array vacío', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(
        /🧠 Escribe algo para empezar tu conversación con el asistente Scrum./i,
      ),
    ).toBeInTheDocument();
  });

  // Test de accesibilidad (aunque ChatWindow y TextInput no se implementan aquí, podríamos hacer pruebas básicas)
  it('el input de texto tiene un rol accesible', () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('el botón de enviar tiene un rol y nombre accesible', () => {
    render(<ScrumAssistantChatWindow chatId={chatId} />);
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
  });
});
