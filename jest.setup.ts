import dotenv from 'dotenv';
import '@testing-library/jest-dom';

dotenv.config();

if (typeof window !== 'undefined' && typeof window.ResizeObserver === 'undefined') {
  // Mock ResizeObserver si no está definido (para evitar errores con @radix-ui)
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  value: () => {},
});
