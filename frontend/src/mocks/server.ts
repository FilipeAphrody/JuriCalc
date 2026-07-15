import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configura um servidor de interceptação de requisições NodeJS para os testes
export const server = setupServer(...handlers);
