import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Footer } from '@/components/ui/features/footer';

describe('<Footer />', () => {
  it('se monta correctamente con el contenido esperado', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    expect(footer).toHaveClass('p-4');
    expect(footer).toHaveClass('text-center');
    expect(footer).toHaveClass('text-gray-400');
    expect(footer).toHaveClass('text-xs');

    expect(screen.getByText(/ScrumMate es un proyecto de código abierto/i)).toBeInTheDocument();
    expect(screen.getByText(/ScrumMate puede cometer errores/i)).toBeInTheDocument();
  });

  it('tiene la estructura HTML correcta', () => {
    const { container } = render(<Footer />);

    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();

    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
  });
});
