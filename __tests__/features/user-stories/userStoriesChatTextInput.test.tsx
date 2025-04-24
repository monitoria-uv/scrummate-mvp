import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserStoriesChatTextInput } from '@/components/ui/features/user-stories/userStoriesChatTextInput';
import { ChatTextInput } from '@/components/ui/features/chatTextInput';

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

describe('<UserStoriesChatTextInput />', () => {
  const mockProps = {
    value: '',
    onChange: jest.fn(),
    onSend: jest.fn(),
    loading: false,
  };

  it('se monta correctamente con todas las props', () => {
    render(<UserStoriesChatTextInput {...mockProps} />);

    expect(screen.getByTestId('chat-text-input')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Describe o pide ayuda sobre historias de usuario...'),
    ).toBeInTheDocument();
  });

  it('maneja correctamente el evento onChange', () => {
    render(<UserStoriesChatTextInput {...mockProps} />);

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'new message' } });

    expect(mockProps.onChange).toHaveBeenCalledWith('new message');
  });

  it('maneja correctamente el evento onSend', () => {
    render(<UserStoriesChatTextInput {...mockProps} value="test message" />);

    const button = screen.getByTestId('send-button');
    fireEvent.click(button);

    expect(mockProps.onSend).toHaveBeenCalledTimes(1);
  });

  it('deshabilita el botón cuando loading es true', () => {
    render(<UserStoriesChatTextInput {...mockProps} loading={true} />);

    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('deshabilita el botón cuando el valor está vacío', () => {
    render(<UserStoriesChatTextInput {...mockProps} value="" />);

    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('aplica las clases CSS personalizadas correctamente', () => {
    render(<UserStoriesChatTextInput {...mockProps} />);

    const input = screen.getByTestId('text-input');
    const button = screen.getByTestId('send-button');

    expect(input).toHaveClass('bg-yellow-50 border-yellow-300 focus-visible:ring-yellow-500');
    expect(button).toHaveClass('bg-yellow-600 hover:bg-yellow-700 text-white');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
