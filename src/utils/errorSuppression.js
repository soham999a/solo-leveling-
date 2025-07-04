// Error suppression for development - reduces console noise from known non-critical errors

const suppressedErrors = [
  'Cross-Origin-Opener-Policy',
  'popup.ts:50',
  'popup.ts:56',
  'Failed to load resource: the server responded with a status of 400',
  'validateProperty',
  'react-dom-client.development.js'
];

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Only suppress in development mode
if (import.meta.env.DEV) {
  console.error = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = suppressedErrors.some(error => 
      message.includes(error)
    );
    
    if (!shouldSuppress) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    const shouldSuppress = suppressedErrors.some(error => 
      message.includes(error)
    );
    
    if (!shouldSuppress) {
      originalConsoleWarn.apply(console, args);
    }
  };
}

// Restore original console methods
export const restoreConsole = () => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
};

export default {
  suppressedErrors,
  restoreConsole
};
