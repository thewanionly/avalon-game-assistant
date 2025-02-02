import '@testing-library/jest-dom';

// resize observer mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// speechSynthesis mocks
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    pause: jest.fn(),
    resume: jest.fn(),
    cancel: jest.fn(),
    speak: jest.fn(),
  },
  writable: true,
});

global.SpeechSynthesisUtterance = jest.fn();
