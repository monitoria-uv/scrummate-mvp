import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatWindow } from '@/components/ui/features/chatWindow';
import type { Message } from '@/types/message';

const mockMessages: Message[] = [
  {
    id: '1',
    chat_id: 'chat-1',
    sender: 'user',
    text: 'Hello',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    chat_id: 'chat-1',
    sender: 'assistant',
    text: 'Hi there!',
    timestamp: new Date().toISOString(),
  },
];

jest.mock('react-markdown', () => (props: any) => {
  return <div data-testid="mock-react-markdown">{props.children}</div>;
});

const mockFetchMessages = jest.fn((chatId: string) => Promise.resolve(mockMessages));
const mockOnSendMessage = jest.fn((input: string) => Promise.resolve(mockMessages));

class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

describe('<ChatWindow />', () => {
  const baseProps = {
    chatId: 'chat-1',
    fetchMessages: mockFetchMessages,
    onSendMessage: mockOnSendMessage,
    refreshTrigger: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).IntersectionObserver = MockIntersectionObserver;
  });

  it('muestra mensaje vacío cuando no hay mensajes', async () => {
    const emptyProps = {
      ...baseProps,
      fetchMessages: jest.fn(() => Promise.resolve([])),
      emptyLabel: 'No hay mensajes',
    };

    render(<ChatWindow {...emptyProps} />);

    expect(await screen.findByText('No hay mensajes')).toBeInTheDocument();
  });

  it('usa renderMessage personalizado cuando se provee', async () => {
    const customRender = (message: Message) => (
      <div key={message.id} data-testid="custom-message">
        {message.text}
      </div>
    );

    render(<ChatWindow {...baseProps} renderMessage={customRender} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('custom-message')).toHaveLength(2);
    });
  });

  it('oculta botón de scroll cuando está en el fondo', async () => {
    const mockObserve = jest.fn((callback: any) => {
      callback([{ isIntersecting: true }]);
    });

    (global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    render(<ChatWindow {...baseProps} />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Ir al final/i })).not.toBeInTheDocument();
    });
  });

  it('hace scroll al fondo cuando se hace clic en el botón', async () => {
    (global as any).IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: () => callback([{ isIntersecting: false }]),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    // Crear un elemento mock para bottomRef
    const mockElement = {
      scrollIntoView: jest.fn(),
    };

    // Mockear useRef para devolver nuestro elemento mock
    jest.spyOn(React, 'useRef').mockImplementation(() => ({
      current: mockElement,
    }));

    render(<ChatWindow {...baseProps} />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Ir al final/i }));
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    (React.useRef as jest.Mock).mockRestore();
  });

  // 4. Tests de efectos
  it('vuelve a cargar mensajes cuando cambia chatId', async () => {
    const { rerender } = render(<ChatWindow {...baseProps} />);

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenCalledWith('chat-1');
    });

    rerender(<ChatWindow {...baseProps} chatId="chat-2" />);

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenCalledWith('chat-2');
      expect(mockFetchMessages).toHaveBeenCalledTimes(2);
    });
  });

  it('vuelve a cargar mensajes cuando cambia refreshTrigger', async () => {
    const { rerender } = render(<ChatWindow {...baseProps} />);

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenCalledTimes(1);
    });

    rerender(<ChatWindow {...baseProps} refreshTrigger={2} />);

    await waitFor(() => {
      expect(mockFetchMessages).toHaveBeenCalledTimes(2);
    });
  });

  it('maneja errores al cargar mensajes', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchMessages.mockRejectedValueOnce(new Error('Fetch error'));

    render(<ChatWindow {...baseProps} />);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Error fetching messages:', expect.any(Error));
    });

    errorSpy.mockRestore();
  });

  it('limpia IntersectionObserver al desmontar', async () => {
    const mockDisconnect = jest.fn();
    const mockObserve = jest.fn();

    (global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    }));

    const { unmount } = render(<ChatWindow {...baseProps} />);

    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled();
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
