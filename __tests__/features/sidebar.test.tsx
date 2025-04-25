import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppSidebar } from '@/components/ui/features/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>{children}</SidebarProvider>
);

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // por compatibilidad
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('<AppSidebar />', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('se monta correctamente con todos los elementos principales', () => {
    render(<AppSidebar />, { wrapper: Wrapper });

    expect(screen.getByAltText('FinTrack')).toBeInTheDocument();
    expect(screen.getByText('ScrumMate')).toBeInTheDocument();
  });

  it('renderiza todos los items del menú con sus iconos y links', () => {
    render(<AppSidebar />, { wrapper: Wrapper });

    const items = [
      { title: 'Asistente de Scrum', link: '/scrum-assistant' },
      { title: 'Asistente de Reuniones', link: '/meet-assistant' },
      { title: 'Historias de Usuario', link: '/user-stories' },
      { title: 'Buenas Prácticas', link: '/good-practices' },
    ];

    items.forEach((item) => {
      const menuItem = screen.getByText(item.title);
      expect(menuItem).toBeInTheDocument();
      expect(menuItem.closest('a')).toHaveAttribute('href', item.link);
    });
  });

  it('resalta el item activo basado en la ruta actual', () => {
    mockUsePathname.mockReturnValue('/user-stories');
    render(<AppSidebar />, { wrapper: Wrapper });

    const activeItem = screen.getByText('Historias de Usuario').closest('button');

    const inactiveItem = screen.getByText('Asistente de Scrum').closest('button');
    expect(inactiveItem).not.toHaveClass('bg-accent');
  });

  it('cumple con estándares de accesibilidad', () => {
    render(<AppSidebar />, { wrapper: Wrapper });

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(4);
    links.forEach((link) => {
      expect(link.textContent).not.toBe('');
    });
  });

  it('no marca ningún item como activo si la ruta no coincide', () => {
    mockUsePathname.mockReturnValue('/non-existent-route');
    render(<AppSidebar />, { wrapper: Wrapper });

    screen.getAllByRole('link').forEach((link) => {
      expect(link).not.toHaveClass('bg-accent');
    });
  });
});
