import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GoodPracticesChatWindow } from '@/components/ui/features/good-practices/goodPracticesChatWindow';
import { getMessagesByChatId, addMessage } from '@/db/db';
import { getGoodPracticesResponse } from '@/utils/gemini';
import type { Message } from '@/types/message';

jest.mock('@/db/db', () => ({
  getMessagesByChatId: jest.fn(),
  addMessage: jest.fn(),
}));

jest.mock('@/utils/gemini', () => ({
  getGoodPracticesResponse: jest.fn(),
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
    chat_id: 'good-practices-chat',
    sender: 'assistant',
    text: 'Recuerda siempre realizar retrospectivas después de cada Sprint.',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    chat_id: 'good-practices-chat',
    sender: 'user',
    text: '¿Qué buenas prácticas existen para el Daily?',
    timestamp: new Date().toISOString(),
  },
];

describe('<GoodPracticesChatWindow />', () => {
  const chatId = 'good-practices-chat';

  beforeEach(() => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue(mockMessages);
    (addMessage as jest.Mock).mockResolvedValue(undefined);
    (getGoodPracticesResponse as jest.Mock).mockResolvedValue('Mantener las Dailies cortas y enfocadas.');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente y muestra el mensaje inicial si no hay mensajes', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<GoodPracticesChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(/📢 Escribe algo para empezar tu conversación con el asistente de buenas prácticas Scrum./i),
    ).toBeInTheDocument();
  });

  it('muestra los mensajes del historial cuando existen', async () => {
    render(<GoodPracticesChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(screen.getByText('¿Qué buenas prácticas existen para el Daily?')).toBeInTheDocument();
      expect(screen.getByText('Recuerda siempre realizar retrospectivas después de cada Sprint.')).toBeInTheDocument();
    });
  });

  it('pasa correctamente el chatId a fetchMessages', async () => {
    render(<GoodPracticesChatWindow chatId={chatId} />);
    await waitFor(() => {
      expect(getMessagesByChatId).toHaveBeenCalledWith(chatId);
    });
    expect(addMessage).not.toHaveBeenCalled(); // Estado inicial
  });

  it('permite al usuario escribir un mensaje en el input', () => {
    render(<GoodPracticesChatWindow chatId={chatId} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '¿Cómo mejorar las retrospectivas?' } });
    expect((input as HTMLInputElement).value).toBe('¿Cómo mejorar las retrospectivas?');
  });

  it('envía un mensaje y llama a las funciones correspondientes', async () => {
    render(<GoodPracticesChatWindow chatId={chatId} />);
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /Enviar/i });

    fireEvent.change(input, { target: { value: '¿Cómo mejorar las retrospectivas?' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addMessage).toHaveBeenCalledTimes(2); // Usuario y asistente
      expect(getGoodPracticesResponse).toHaveBeenCalledWith('¿Cómo mejorar las retrospectivas?');
    });
  });

  it('no envía mensaje si el input está vacío', () => {
    render(<GoodPracticesChatWindow chatId={chatId} />);
    const sendButton = screen.getByRole('button', { name: /Enviar/i });
    fireEvent.click(sendButton);
    expect(addMessage).not.toHaveBeenCalled();
  });

  it('muestra el mensaje vacío si la carga inicial de mensajes devuelve un array vacío', async () => {
    (getMessagesByChatId as jest.Mock).mockResolvedValue([]);
    render(<GoodPracticesChatWindow chatId={chatId} />);
    expect(
      await screen.findByText(/📢 Escribe algo para empezar tu conversación con el asistente de buenas prácticas Scrum./i),
    ).toBeInTheDocument();
  });

  it('tiene roles accesibles para el input y el botón', () => {
    render(<GoodPracticesChatWindow chatId={chatId} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
  });
});
