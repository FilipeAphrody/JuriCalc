# Plano de Execução do Agente (Fases)

**Fase 1: Fundação Core**
- [ ] Task 1: Inicializar projeto Django e apps (`core`, `api`, `engines.civil`, `engines.labor`, `engines.banking`, `engines.pension`, `engines.family`, `engines.tax`).
- [ ] Task 2: Implementar Modelos Base em `core/models.py` (EconomicIndex, AuditLog, CalculationVersion).
- [ ] Task 3: Implementar o motor matemático unificado em `core/math_engine.py` com suporte a juros simples/compostos e métodos de amortização.

**Fase 2: Motores Baseados em Atualização (App: Civil & Tax)**
- [ ] Task 4: Implementar `engines/civil/services.py` cobrindo Dívidas, Execução, Aluguel e Condomínio.
- [ ] Task 5: Implementar `engines/tax/services.py` focado em atualização SELIC.

**Fase 3: Motores Complexos Isolados**
- [ ] Task 6: Implementar `engines/banking/services.py` (Geradores de Tabela Price, SAC e SACRE).
- [ ] Task 7: Implementar `engines/labor/services.py` (Regras de CLT, Horas Extras, FGTS, reflexos).
- [ ] Task 8: Implementar `engines/pension/services.py` e `engines/family/services.py`.

**Fase 4: Exposição REST**
- [ ] Task 9: Criar Endpoints no DRF mapeando todos os motores, gerar Swagger.