// Archivo: ScrumAssistantChatMessage.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScrumAssistantChatMessage } from '@/components/ui/features/scrum-assistant/scrumAssistantChatMessage';
import type { Message } from '@/types/message';

jest.mock('@/components/ui/features/chatMessage', () => ({
  ChatMessage: jest.fn((props) => (
    <div data-testid="chat-message">
      <div data-testid="message-sender">{props.message.sender}</div>
      <div data-testid="message-text">{props.message.text}</div>
      <div data-testid="avatar-container">{props.renderAvatar(props.message.sender)}</div>
      <div data-testid="message-styles">{JSON.stringify(props.messageStyles)}</div>
    </div>
  )),
}));

jest.mock('@radix-ui/react-avatar', () => ({
  Avatar: jest.fn(({ children, className }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  )),
  AvatarFallback: jest.fn(({ children }) => <div data-testid="avatar-fallback">{children}</div>),
}));

describe('<ScrumAssistantChatMessage />', () => {
  const mockUserMessage: Message = {
    id: '1',
    chat_id: 'chat-1',
    sender: 'user',
    text: 'User message text',
    timestamp: new Date().toISOString(),
  };

  const mockAssistantMessage: Message = {
    id: '2',
    chat_id: 'chat-1',
    sender: 'assistant',
    text: 'Assistant message text',
    timestamp: new Date().toISOString(),
  };

  it('se monta correctamente con mensaje de usuario', () => {
    render(<ScrumAssistantChatMessage message={mockUserMessage} />);

    expect(screen.getByTestId('chat-message')).toBeInTheDocument();
    expect(screen.getByTestId('message-text')).toHaveTextContent('User message text');
    expect(screen.getByTestId('message-sender')).toHaveTextContent('user');
  });

  it('se monta correctamente con mensaje de asistente', () => {
    render(<ScrumAssistantChatMessage message={mockAssistantMessage} />);

    expect(screen.getByTestId('chat-message')).toBeInTheDocument();
    expect(screen.getByTestId('message-text')).toHaveTextContent('Assistant message text');
    expect(screen.getByTestId('message-sender')).toHaveTextContent('assistant');
  });

  it('renderiza el avatar correcto para cada tipo de mensaje', () => {
    // Test para mensaje de usuario
    const { rerender } = render(<ScrumAssistantChatMessage message={mockUserMessage} />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('👨‍💻');
    expect(screen.getByTestId('avatar')).toHaveClass('h-8 w-8');

    // Test para mensaje de asistente
    rerender(<ScrumAssistantChatMessage message={mockAssistantMessage} />);
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('🧠');
  });

  it('aplica los estilos personalizados correctamente', () => {
    render(<ScrumAssistantChatMessage message={mockUserMessage} />);

    const stylesText = screen.getByTestId('message-styles').textContent;
    const styles = stylesText ? JSON.parse(stylesText) : {};

    expect(styles.user).toBe('bg-yellow-100 dark:bg-yellow-900 text-right');
    expect(styles.assistant).toBe('bg-green-100 dark:bg-green-900 text-left');
  });

  // 5. Edge cases
  it('maneja correctamente mensajes sin sender definido', () => {
    const invalidMessage = { ...mockUserMessage, sender: undefined } as unknown as Message;
    render(<ScrumAssistantChatMessage message={invalidMessage} />);

    // Verificar que el componente no falla
    expect(screen.getByTestId('chat-message')).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
