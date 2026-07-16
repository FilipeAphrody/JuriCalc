import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CalculationWizard } from './CalculationWizard';

describe('CalculationWizard Integration', () => {
  it('renders the first step correctly', () => {
    render(
      <MemoryRouter>
        <CalculationWizard />
      </MemoryRouter>
    );
    expect(screen.getByText('Novo Cálculo Jurídico')).toBeInTheDocument();
    expect(screen.getByText('Tipo de Cálculo')).toBeInTheDocument();
  });

  it('prevents navigation if calculation type is not selected', async () => {
    render(
      <MemoryRouter>
        <CalculationWizard />
      </MemoryRouter>
    );

    // O botão deve estar desabilitado se não selecionou nada
    const nextBtn = screen.getByRole('button', { name: 'Próxima Etapa' });
    expect(nextBtn).toBeDisabled();
  });

  it('simulates a complete flow', async () => {
    render(
      <MemoryRouter>
        <CalculationWizard />
      </MemoryRouter>
    );

    // Etapa 0: Selecionar o tipo de cálculo e avançar
    fireEvent.click(screen.getByRole('button', { name: /Cálculo Trabalhista/i }));
    const nextBtn1 = screen.getByRole('button', { name: 'Próxima Etapa' });
    expect(nextBtn1).not.toBeDisabled();
    fireEvent.click(nextBtn1);

    // Etapa 1: Preencher Dados Básicos e avançar
    await waitFor(() => {
      expect(screen.getByLabelText('Valor Principal (R$)')).toBeInTheDocument();
    });
    const principalInput = screen.getByLabelText('Valor Principal (R$)');
    fireEvent.change(principalInput, { target: { value: '1000.00' } });
    
    // Avança para Resultado
    fireEvent.click(screen.getByRole('button', { name: 'Gerar Cálculo' }));

    // Etapa 2: Resultado
    await waitFor(() => {
      expect(screen.getByText('Cálculo Gerado com Sucesso!')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Salvar e Exportar' })).toBeInTheDocument();
    });
  });
});
