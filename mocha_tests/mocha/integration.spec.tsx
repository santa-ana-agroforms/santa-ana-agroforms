import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { LoginCard } from '../../src/components/LoginCard';

describe('Integración básica', () => {
  it('componentes React se renderizan sin errores', () => {
    // Verificar que el sistema de rendering funciona
    const { container } = render(<LoginCard onFinish={() => {}} />);
    expect(container).to.exist;
    expect(container.querySelector('form')).to.exist;
  });

  it('variables de entorno están configuradas correctamente', () => {
    // Verificar que las variables de entorno necesarias están disponibles
    expect(process.env.NODE_ENV).to.equal('test');
    expect(process.env.VITE_API_BASE_URL).to.equal('http://localhost:5173');
  });
});