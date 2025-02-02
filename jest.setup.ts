import '@testing-library/jest-dom';

// resize observer mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// speechSynthesis mock
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    pause: jest.fn(),
    resume: jest.fn(),
    cancel: jest.fn(),
    speak: jest.fn(),
  },
  writable: true,
});
