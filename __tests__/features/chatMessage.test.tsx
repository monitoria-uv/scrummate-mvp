import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@/components/ui/features/chatMessage';
import type { Message } from '@/types/message';
import '@testing-library/jest-dom';

const createMessage = (override?: Partial<Message>): Message => ({
  id: '1',
  chat_id: 'chat-1',
  sender: 'user',
  text: 'Hola, soy un mensaje de prueba',
  timestamp: new Date().toISOString(),
  ...override,
});

jest.mock('react-markdown', () => (props: any) => {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
});

describe('ChatMessage', () => {
  it('renderiza un mensaje del usuario correctamente', () => {
    const message = createMessage({ sender: 'user' });

    render(<ChatMessage message={message} />);

    expect(screen.getByText(/hola, soy un mensaje de prueba/i)).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument(); // avatar
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument(); // hora
  });

  it('renderiza un mensaje del asistente correctamente', () => {
    const message = createMessage({
      sender: 'assistant',
      text: 'Respuesta generada por IA',
    });

    render(<ChatMessage message={message} />);

    expect(screen.getByText(/respuesta generada por ia/i)).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument(); // avatar
  });

  it('aplica clases personalizadas de estilo según el remitente', () => {
    const message = createMessage({ sender: 'user' });

    const customStyles = {
      user: 'bg-custom-user',
      assistant: 'bg-custom-assistant',
    };

    const { container } = render(<ChatMessage message={message} messageStyles={customStyles} />);

    expect(container.querySelector('.bg-custom-user')).toBeInTheDocument();
  });

  it('utiliza una función personalizada para renderizar avatar si se provee', () => {
    const message = createMessage({ sender: 'assistant' });

    const renderAvatar = (sender: string) => (
      <span>{sender === 'assistant' ? '🤖 Custom' : '👤 Custom'}</span>
    );

    render(<ChatMessage message={message} renderAvatar={renderAvatar} />);

    expect(screen.getByText('🤖 Custom')).toBeInTheDocument();
  });

  it('aplica clases adicionales si se proveen via props', () => {
    const message = createMessage();

    const { container } = render(
      <ChatMessage
        message={message}
        className="extra-container-class"
        contentClassName="custom-content"
      />,
    );

    expect(container.querySelector('.extra-container-class')).toBeInTheDocument();
    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });
});
