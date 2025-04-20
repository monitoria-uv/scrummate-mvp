import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatTextInput } from '@/components/ui/features/chatTextInput';

describe('<ChatTextInput />', () => {
  const mockProps = {
    value: '',
    onChange: jest.fn(),
    onSend: jest.fn(),
  };

  it('se monta correctamente con props mínimas', () => {
    render(<ChatTextInput {...mockProps} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Escribe tu mensaje y presiona Enter...'),
    ).toBeInTheDocument();
  });

  it('aplica placeholder personalizado', () => {
    const customPlaceholder = 'Escribe aquí...';
    render(<ChatTextInput {...mockProps} placeholder={customPlaceholder} />);

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('muestra el botón deshabilitado cuando loading es true', () => {
    render(<ChatTextInput {...mockProps} loading={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('muestra el botón deshabilitado cuando el valor está vacío', () => {
    render(<ChatTextInput {...mockProps} value="" />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('muestra icono y label personalizados en el botón', () => {
    const customIcon = <span data-testid="custom-icon">📨</span>;
    render(<ChatTextInput {...mockProps} buttonIcon={customIcon} buttonLabel="Enviar Mensaje" />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  it('llama a onChange cuando se escribe en el textarea', () => {
    render(<ChatTextInput {...mockProps} />);
    const textarea = screen.getByRole('textbox');
    const testValue = 'Hola mundo';

    fireEvent.change(textarea, { target: { value: testValue } });

    expect(mockProps.onChange).toHaveBeenCalledWith(testValue);
  });

  it('llama a onSend al hacer submit del formulario con texto válido', () => {
    render(<ChatTextInput {...mockProps} value="Mensaje de prueba" />);
    const form = screen.getByRole('textbox').closest('form')!;

    fireEvent.submit(form);

    expect(mockProps.onSend).toHaveBeenCalledTimes(1);
  });

  it('no llama a onSend si el texto está vacío', () => {
    render(<ChatTextInput {...mockProps} value=" " />);
    const form = screen.getByRole('textbox').closest('form')!;

    fireEvent.submit(form);

    expect(mockProps.onSend).not.toHaveBeenCalled();
  });

  it('llama a onSend al presionar Enter sin Shift', () => {
    render(<ChatTextInput {...mockProps} value="Mensaje válido" />);
    const textarea = screen.getByRole('textbox');

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(mockProps.onSend).toHaveBeenCalledTimes(1);
  });

  it('no llama a onSend al presionar Enter con Shift', () => {
    render(<ChatTextInput {...mockProps} value="Mensaje válido" />);
    const textarea = screen.getByRole('textbox');

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockProps.onSend).not.toHaveBeenCalled();
  });

  it('no llama a onSend cuando está en estado loading', () => {
    render(<ChatTextInput {...mockProps} value="Mensaje" loading={true} />);
    const form = screen.getByRole('textbox').closest('form')!;

    fireEvent.submit(form);

    expect(mockProps.onSend).not.toHaveBeenCalled();
  });

  it('aplica clases personalizadas al wrapper', () => {
    const { container } = render(
      <ChatTextInput {...mockProps} wrapperClassName="custom-wrapper" />,
    );

    expect(container.firstChild).toHaveClass('custom-wrapper');
  });

  it('aplica clases personalizadas al textarea', () => {
    render(<ChatTextInput {...mockProps} textareaClassName="custom-textarea" />);

    expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
  });

  it('aplica clases personalizadas al botón', () => {
    render(<ChatTextInput {...mockProps} buttonClassName="custom-button" />);

    expect(screen.getByRole('button')).toHaveClass('custom-button');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
