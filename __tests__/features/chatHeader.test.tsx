import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatHeader } from '@/components/ui/features/chatHeader';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

describe('ChatHeader component', () => {
  it('renders with default tag (header) and title', () => {
    render(<ChatHeader title="Test Title" />);
    const heading = screen.getByRole('heading', { name: /test title/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName.toLowerCase()).toBe('h1');
    expect(heading.closest('header')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(<ChatHeader title="Chat" icon={<ChatBubbleIcon data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders children on the right', () => {
    render(
      <ChatHeader title="With Children">
        <button>Extra</button>
      </ChatHeader>,
    );
    expect(screen.getByRole('button', { name: /extra/i })).toBeInTheDocument();
  });

  it('uses the specified element type via `as` prop', () => {
    render(<ChatHeader as="nav" title="Inside Nav" />);
    const heading = screen.getByRole('heading', { name: /inside nav/i });
    expect(heading.closest('nav')).toBeInTheDocument();
  });

  it('applies additional props (like id)', () => {
    render(<ChatHeader title="With ID" id="my-header" />);
    expect(screen.getByRole('heading', { name: /with id/i }).closest('header')).toHaveAttribute(
      'id',
      'my-header',
    );
  });

  it('applies custom className correctly', () => {
    render(<ChatHeader title="Styled" className="bg-red-500" />);
    const header = screen.getByRole('heading', { name: /styled/i }).closest('header');
    expect(header).toHaveClass('bg-red-500');
  });
});
