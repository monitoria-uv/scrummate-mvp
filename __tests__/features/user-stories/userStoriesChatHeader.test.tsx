import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserStoriesChatHeader } from '@/components/ui/features/user-stories/userStoriesChatHeader';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

// Mock del componente ChatHeader
jest.mock('@/components/ui/features/chatHeader', () => ({
  ChatHeader: jest.fn(({ children, title, icon }) => (
    <div data-testid="chat-header">
      <div data-testid="header-title">{title}</div>
      <div data-testid="header-icon">{icon}</div>
      <div data-testid="header-actions">{children}</div>
    </div>
  )),
}));

// Mock de los componentes de diálogo
jest.mock('@/components/ui/dialog', () => ({
  Dialog: jest.fn(({ children }) => <div>{children}</div>),
  DialogContent: jest.fn(({ children }) => <div data-testid="dialog-content">{children}</div>),
  DialogHeader: jest.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: jest.fn(({ children }) => (
    <h2 data-testid="dialog-title" className="text-lg font-semibold">
      {children}
    </h2>
  )),
  DialogTrigger: jest.fn(({ children }) => <div>{children}</div>),
}));

// Mock de los iconos
jest.mock('@radix-ui/react-icons', () => ({
  QuestionMarkCircledIcon: jest.fn(() => <div data-testid="help-icon" />),
  ChatBubbleIcon: jest.fn(() => <div data-testid="chat-icon" />),
}));

describe('<UserStoriesChatHeader />', () => {
  // 1. Test de renderizado básico
  it('se monta correctamente con todos los elementos principales', () => {
    render(<UserStoriesChatHeader />);

    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent(
      'Asistente de Historias de Usuario',
    );
    expect(screen.getByTestId('help-icon')).toBeInTheDocument();
  });

  // 2. Test de diálogo de ayuda
  describe('Diálogo de ayuda', () => {
    it('muestra el botón de ayuda', () => {
      render(<UserStoriesChatHeader />);
      expect(
        screen.getByRole('button', { name: 'Manual de ayuda de Historias de Usuario' }),
      ).toBeInTheDocument();
    });

    it('abre el diálogo al hacer clic en el botón de ayuda', async () => {
      render(<UserStoriesChatHeader />);

      const helpButton = screen.getByRole('button', {
        name: 'Manual de ayuda de Historias de Usuario',
      });
      fireEvent.click(helpButton);

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent(
        'Guía del Asistente de Historias de Usuario',
      );
    });

    it('muestra el contenido correcto del diálogo', async () => {
      render(<UserStoriesChatHeader />);

      // Abrir diálogo
      fireEvent.click(
        screen.getByRole('button', { name: 'Manual de ayuda de Historias de Usuario' }),
      );

      // Verificar contenido
      expect(screen.getByText('Para comenzar una historia')).toBeInTheDocument();
      expect(screen.getByText('Para mejorar historias existentes')).toBeInTheDocument();
    });
  });

  // 3. Test de accesibilidad
  it('cumple con estándares básicos de accesibilidad', async () => {
    render(<UserStoriesChatHeader />);

    // Verificar botón de ayuda
    const helpButton = screen.getByRole('button', {
      name: 'Manual de ayuda de Historias de Usuario',
    });
    expect(helpButton).toHaveAttribute('aria-label', 'Manual de ayuda de Historias de Usuario');

    // Abrir diálogo y verificar headings
    fireEvent.click(helpButton);

    // Verificar heading principal
    const mainHeading = await screen.findByRole('heading', {
      name: 'Guía del Asistente de Historias de Usuario',
      level: 2,
    });
    expect(mainHeading).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
