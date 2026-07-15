import '@testing-library/jest-dom';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Estabelece os interceptores de API antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reseta qualquer request handler que foi adicionado durante o teste,
// para que eles não afetem outros testes.
afterEach(() => server.resetHandlers());

// Limpa tudo quando os testes terminam
afterAll(() => server.close());
