import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth Mock (Login)
  http.post('http://localhost:8000/api/v1/auth/token/', async ({ request }) => {
    const data = await request.json() as any;
    
    // Simula erro de credenciais (Unhappy Path)
    if (data.username === 'invalido') {
      return new HttpResponse(
        JSON.stringify({ detail: 'No active account found with the given credentials' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Simula sucesso
    return HttpResponse.json({
      access: 'mocked_jwt_token_123',
      user: {
        id: 1,
        username: data.username,
        email: `${data.username}@escritorio.com`,
        officeId: '1'
      }
    });
  }),

  // Calculation Mock (Wizard)
  http.post('http://localhost:8000/api/v1/civil/calculate/', async () => {
    // Simulação do resultado de sucesso vindo da Engine de Regras
    return HttpResponse.json({
      meta: { calculation_id: 1, version_number: 1 },
      result: {
        summary: {
          principal: 1000.0,
          interest_amount: 120.50,
          fees_amount: 254.10,
          total: 1524.60
        },
        memory: []
      }
    });
  }),
];
