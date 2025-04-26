import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserStoriesChatWindow } from '@/components/ui/features/user-stories/userStoriesChatWindow';
import { getMessagesByChatId, addMessage } from '@/db/db';
import { getUserStoriesResponse } from '@/utils/gemini';
import type { Message } from '@/types/message';

jest.mock('@/db/db', () => ({
  getMessagesByChatId: jest.fn(),
  addMessage: jest.fn(),
}));

jest.mock('@/utils/gemini', () => ({
  getUserStoriesResponse: jest.fn(),
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
    chat_id: 'user-stories-chat',
    sender: 'assistant',
    text: 'Puedes usar el formato: Como usuario...',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    chat_id: 'user-stories-chat',
    sender: 'user',
    text: '¿Cómo redacto una buena historia?',
    timestamp: new Date().toISOString(),
  },
];

describe('<UserStoriesChatWindow />', () => {
  const chatId = 'user-stories-chat';

  beforeEach(() => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue(mockMessages);
    (addMessage as jest.Mock).mockResolvedValue(undefined);
    (getUserStoriesResponse as jest.Mock).mockResolvedValue('Intenta con el formato INVEST.');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente y muestra el mensaje inicial si no hay mensajes', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<UserStoriesChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(/📘 Comienza preguntando sobre tus historias de usuario./i),
    ).toBeInTheDocument();
  });

  it('muestra los mensajes del historial cuando existen', async () => {
    render(<UserStoriesChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(screen.getByText('¿Cómo redacto una buena historia?')).toBeInTheDocument();
      expect(screen.getByText('Puedes usar el formato: Como usuario...')).toBeInTheDocument();
    });
  });

  it('pasa correctamente el chatId a fetchMessages', async () => {
    render(<UserStoriesChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(getMessagesByChatId).toHaveBeenCalledWith(chatId);
    });
    expect(addMessage).not.toHaveBeenCalled(); // Estado inicial
  });

  it('permite al usuario escribir un mensaje en el input', () => {
    render(<UserStoriesChatWindow chatId={chatId} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '¿Cómo escribir historias pequeñas?' } });
    expect((input as HTMLInputElement).value).toBe('¿Cómo escribir historias pequeñas?');
  });

  it('envía un mensaje y llama a las funciones correspondientes', async () => {
    render(<UserStoriesChatWindow chatId={chatId} />);
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Enviar/i });

    fireEvent.change(input, { target: { value: '¿Qué es INVEST?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledTimes(2);
      expect(getUserStoriesResponse).toHaveBeenCalledWith('¿Qué es INVEST?');
    });
  });

  it('no envía mensaje si el input está vacío', () => {
    render(<UserStoriesChatWindow chatId={chatId} />);
    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);
    expect(addMessage).not.toHaveBeenCalled();
  });

  it('muestra el mensaje vacío si la carga inicial de mensajes devuelve un array vacío', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<UserStoriesChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(/📘 Comienza preguntando sobre tus historias de usuario./i),
    ).toBeInTheDocument();
  });

  it('tiene roles accesibles para el input y el botón', () => {
    render(<UserStoriesChatWindow chatId={chatId} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
  });
});
