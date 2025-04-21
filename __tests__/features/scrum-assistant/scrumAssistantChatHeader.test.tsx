import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScrumAssistantChatHeader } from '@/components/ui/features/scrum-assistant/scrumAssistantChatHeader';
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

describe('<ScrumAssistantChatHeader />', () => {
  // 1. Test de renderizado básico
  it('se monta correctamente con todos los elementos principales', () => {
    render(<ScrumAssistantChatHeader />);

    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Asistente Scrum');
    expect(screen.getByTestId('help-icon')).toBeInTheDocument();
  });

  // 2. Test de diálogo de ayuda
  describe('Diálogo de ayuda', () => {
    it('muestra el botón de ayuda', () => {
      render(<ScrumAssistantChatHeader />);
      expect(screen.getByRole('button', { name: 'Manual de ayuda' })).toBeInTheDocument();
    });

    it('abre el diálogo al hacer clic en el botón de ayuda', async () => {
      render(<ScrumAssistantChatHeader />);

      const helpButton = screen.getByRole('button', { name: 'Manual de ayuda' });
      fireEvent.click(helpButton);

      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Guía del Asistente Scrum');
    });

    it('muestra el contenido correcto del diálogo', async () => {
      render(<ScrumAssistantChatHeader />);

      // Abrir diálogo
      fireEvent.click(screen.getByRole('button', { name: 'Manual de ayuda' }));

      // Verificar contenido
      expect(screen.getByText('Para nuevos en Scrum')).toBeInTheDocument();
      expect(screen.getByText('Para equipos establecidos')).toBeInTheDocument();
      expect(screen.getByText('Otros asistentes disponibles')).toBeInTheDocument();
      expect(screen.getByText('Asistente de Reuniones')).toBeInTheDocument();
      expect(screen.getByText('Historias de Usuario')).toBeInTheDocument();
      expect(screen.getByText('Buenas Prácticas')).toBeInTheDocument();
    });
  });

  // 3. Test de accesibilidad
  it('cumple con estándares básicos de accesibilidad', async () => {
    render(<ScrumAssistantChatHeader />);

    // Verificar botón de ayuda
    const helpButton = screen.getByRole('button', { name: 'Manual de ayuda' });
    expect(helpButton).toHaveAttribute('aria-label', 'Manual de ayuda');

    // Abrir diálogo y verificar headings
    fireEvent.click(helpButton);

    // Verificar heading principal
    const mainHeading = await screen.findByRole('heading', {
      name: 'Guía del Asistente Scrum',
      level: 2,
    });
    expect(mainHeading).toBeInTheDocument();

    // Verificar otros headings
    expect(
      screen.getByRole('heading', {
        name: 'Otros asistentes disponibles',
        level: 3,
      }),
    ).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
