import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoodPracticesModule from '@/components/ui/features/good-practices/module';

// Mock child components
jest.mock('@/components/ui/features/good-practices/goodPracticesChatHeader', () => ({
  GoodPracticesChatHeader: () => <div data-testid="chat-header">Chat Header</div>,
}));

jest.mock('react-markdown', () => (props: any) => {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
});

jest.mock('@/components/ui/features/good-practices/goodPracticesChatWindow', () => {
  const originalModule = jest.requireActual(
    '@/components/ui/features/good-practices/goodPracticesChatWindow',
  );
  return {
    ...originalModule,
    GoodPracticesChatWindow: jest
      .fn()
      .mockImplementation(() => <div data-testid="chat-window">Chat Window</div>),
  };
});

jest.mock('@/components/ui/features/footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

describe('<GoodPracticesModule />', () => {
  // 1. Test de renderizado básico
  it('se monta correctamente con todos los componentes hijos', () => {
    render(<GoodPracticesModule />);

    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('chat-window')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  // 2. Test de estructura del layout
  it('renderiza los componentes en el orden correcto', () => {
    render(<GoodPracticesModule />);

    const header = screen.getByTestId('chat-header');
    const window = screen.getByTestId('chat-window');
    const footer = screen.getByTestId('footer');

    // Verificar que existen
    expect(header).toBeInTheDocument();
    expect(window).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Verificar orden relativo (opcional, si es crítico para el layout)
    expect(header.compareDocumentPosition(window)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(window.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
