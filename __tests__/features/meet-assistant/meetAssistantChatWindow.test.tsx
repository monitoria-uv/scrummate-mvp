import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MeetAssistantChatWindow } from '@/components/ui/features/meet-assistant/meetAssistantChatWindow';
import { getMessagesByChatId, addMessage } from '@/db/db';
import { getScrumCeremonyResponse } from '@/utils/gemini';
import type { Message } from '@/types/message';

jest.mock('@/db/db', () => ({
  getMessagesByChatId: jest.fn(),
  addMessage: jest.fn(),
}));

jest.mock('@/utils/gemini', () => ({
  getScrumCeremonyResponse: jest.fn(),
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

const mockMessages: Message[] = [
  {
    id: '1',
    chat_id: 'scrum-meeting-chat',
    sender: 'assistant',
    text: 'Bienvenido al asistente de reuniones Scrum.',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    chat_id: 'scrum-meeting-chat',
    sender: 'user',
    text: '¿Qué es una Daily?',
    timestamp: new Date().toISOString(),
  },
];

describe('<MeetAssistantChatWindow />', () => {
  const chatId = 'scrum-meeting-chat';

  beforeEach(() => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue(mockMessages);
    (addMessage as jest.Mock).mockResolvedValue(undefined);
    (getScrumCeremonyResponse as jest.Mock).mockResolvedValue('Una Daily es una reunión breve diaria.');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente y muestra el mensaje inicial si no hay mensajes', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<MeetAssistantChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(
        /🤝 Escribe algo para empezar tu conversación con el asistente de ceremonias Scrum./i,
      ),
    ).toBeInTheDocument();
  });

  it('muestra los mensajes del historial cuando existen', async () => {
    render(<MeetAssistantChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(screen.getByText('¿Qué es una Daily?')).toBeInTheDocument();
      expect(screen.getByText('Bienvenido al asistente de reuniones Scrum.')).toBeInTheDocument();
    });
  });

  it('pasa correctamente el chatId a fetchMessages', async () => {
    render(<MeetAssistantChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(getMessagesByChatId).toHaveBeenCalledWith(chatId);
    });
    expect(addMessage).not.toHaveBeenCalled(); // Estado inicial
  });

  it('permite al usuario escribir un mensaje en el input', () => {
    render(<MeetAssistantChatWindow chatId={chatId} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '¿Qué es una retrospectiva?' } });
    expect((input as HTMLInputElement).value).toBe('¿Qué es una retrospectiva?');
  });

  it('envía un mensaje y llama a las funciones correspondientes', async () => {
    render(<MeetAssistantChatWindow chatId={chatId} />);
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Enviar/i });

    fireEvent.change(input, { target: { value: '¿Qué es una retrospectiva?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledTimes(2); // Usuario y asistente
      expect(getScrumCeremonyResponse).toHaveBeenCalledWith('¿Qué es una retrospectiva?');
    });
  });

  it('no envía mensaje si el input está vacío', () => {
    render(<MeetAssistantChatWindow chatId={chatId} />);
    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);
    expect(addMessage).not.toHaveBeenCalled();
  });

  it('muestra el mensaje vacío si la carga inicial de mensajes devuelve un array vacío', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<MeetAssistantChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(
        /🤝 Escribe algo para empezar tu conversación con el asistente de ceremonias Scrum./i,
      ),
    ).toBeInTheDocument();
  });

  it('tiene roles accesibles para el input y el botón', () => {
    render(<MeetAssistantChatWindow chatId={chatId} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
  });
});
