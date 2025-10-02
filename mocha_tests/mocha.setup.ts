import 'jsdom-global/register';
import { expect } from 'chai';

// Polyfills mínimos
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Silenciar errores de React act() en pruebas simples
const origError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
  // @ts-ignore
  origError(...args);
};

// Exponer expect por comodidad
// @ts-ignore
global.expect = expect;