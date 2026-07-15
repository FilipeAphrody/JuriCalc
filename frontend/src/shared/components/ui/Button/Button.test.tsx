import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders the button with children', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clicar</Button>);
    
    const button = screen.getByText('Clicar');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Desabilitado</Button>);
    
    const button = screen.getByRole('button', { name: 'Desabilitado' });
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state and prevents clicks', () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Processando</Button>);
    
    const button = screen.getByRole('button');
    // Button must be disabled while loading
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
