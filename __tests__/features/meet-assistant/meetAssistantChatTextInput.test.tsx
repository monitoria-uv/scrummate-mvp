// Archivo: MeetAssistantChatTextInput.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MeetAssistantChatTextInput } from '@/components/ui/features/meet-assistant/meetAssistantChatTextInput';

// Mock del componente ChatTextInput para verificar props
jest.mock('@/components/ui/features/chatTextInput', () => ({
  ChatTextInput: jest.fn((props) => (
    <div data-testid="chat-text-input">
      <input
        data-testid="text-input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className={props.textareaClassName}
      />
      <button
        data-testid="send-button"
        onClick={props.onSend}
        disabled={props.loading || props.value.trim() === ''}
        className={props.buttonClassName}
      >
        {props.buttonLabel}
      </button>
    </div>
  )),
}));

describe('<ScrumAssistantChatTextInput />', () => {
  const mockProps = {
    value: '',
    onChange: jest.fn(),
    onSend: jest.fn(),
    loading: false,
  };

  it('se monta correctamente con todas las props', () => {
    render(<MeetAssistantChatTextInput {...mockProps} />);

    expect(screen.getByTestId('chat-text-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Habla con tu asistente de reuniones/ceremonias Scrum...')).toBeInTheDocument();
  });

  it('maneja correctamente el evento onChange', () => {
    render(<MeetAssistantChatTextInput {...mockProps} />);

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'new message' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('new message');
  });

  it('maneja correctamente el evento onSend', () => {
    render(<MeetAssistantChatTextInput {...mockProps} value="test message" />);

    const button = screen.getByTestId('send-button');
    fireEvent.click(button);

    expect(mockProps.onSend).toHaveBeenCalledTimes(1);
  });

  it('deshabilita el botón cuando loading es true', () => {
    render(<MeetAssistantChatTextInput {...mockProps} loading={true} />);

    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('deshabilita el botón cuando el valor está vacío', () => {
    render(<MeetAssistantChatTextInput {...mockProps} value="" />);

    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('aplica las clases CSS personalizadas correctamente', () => {
    render(<MeetAssistantChatTextInput {...mockProps} />);

    const input = screen.getByTestId('text-input');
    const button = screen.getByTestId('send-button');

    expect(input).toHaveClass('bg-blue-50 border-blue-300 focus-visible:ring-blue-500');
    expect(button).toHaveClass('bg-blue-600 hover:bg-blue-700 text-white');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
