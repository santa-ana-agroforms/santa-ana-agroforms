import React from 'react';
import { render, screen } from '@testing-library/react';
import BaseModal from '@/components/BaseModal';

describe('BaseModal', () => {
  test('Cuando visible=true muestra título y contenido', () => {
    render(
      <BaseModal title="Nuevo" open onCancel={() => {}}>
        <div>Contenido del modal</div>
      </BaseModal>
    );
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
  });

  test('Cuando visible=false no muestra contenido', () => {
    render(
      <BaseModal title="X" visible={false} onCancel={() => {}}>
        <div>Contenido</div>
      </BaseModal>
    );
    expect(screen.queryByText('Contenido')).not.toBeInTheDocument();
  });
});
