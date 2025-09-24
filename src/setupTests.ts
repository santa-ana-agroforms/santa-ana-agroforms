import React from 'react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
if (!global.TextEncoder) (global as any).TextEncoder = TextEncoder;
// @ts-ignore
if (!global.TextDecoder) (global as any).TextDecoder = TextDecoder as any;

// matchMedia para breakpoints de AntD
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),            // legacy
    removeListener: jest.fn(),
    addEventListener: jest.fn(),       // moderno
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const _getComputedStyle = window.getComputedStyle?.bind(window) as typeof window.getComputedStyle;
window.getComputedStyle = ((elt: Element) => {
  return _getComputedStyle ? _getComputedStyle(elt) : ({ getPropertyValue: () => '' } as any);
}) as typeof window.getComputedStyle;

jest.mock('@ant-design/plots', () => {
  const React = require('react');
  const stub =
    (testId: string) =>
    (props: any) =>
      React.createElement('div', {
        'data-testid': props?.['data-testid'] || testId,
      });

  return {
    __esModule: true,
    Line: stub('ant-plot-line'),
    Column: stub('ant-plot-column'),
    Pie: stub('ant-plot-pie'),
    Area: stub('ant-plot-area'),
  };
});

const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args: any[]) => {
    const [first] = args;
    if (typeof first === 'string' && (
        first.includes('[antd: Modal] `visible` is deprecated') ||
        first.includes('Not implemented: window.getComputedStyle')
      )) {
      return;
    }
    (originalError as any)(...args);
  });

  jest.spyOn(console, 'warn').mockImplementation((...args: any[]) => {
    const [first] = args;
    if (typeof first === 'string' && first.includes('A function to advance timers was called')) {
      return;
    }
    (originalWarn as any)(...args);
  });
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});
