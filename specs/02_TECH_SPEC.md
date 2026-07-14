# Especificação Técnica: Backend Django (Monólito Modular)
## 1. Stack Tecnológico
- Python 3.12+, Django 5.x, Django REST Framework, SQLite. Documentação via `drf-spectacular`.

## 2. Core Matemático (`core/math_engine.py`)
Deve implementar funções puras que serão importadas por todos os motores:
- `apply_monetary_correction(value: Decimal, index_name: str, start_date: date, end_date: date) -> Decimal`
- `calculate_interest(value: Decimal, rate: Decimal, type: str, start_date: date, end_date: date) -> Decimal`
- `amortization_price(principal: Decimal, rate: Decimal, periods: int) -> list[dict]`
- `amortization_sac(principal: Decimal, rate: Decimal, periods: int) -> list[dict]`

## 3. Padrão de API por Domínio
Cada app dentro de `engines/` deve expor um arquivo `services.py` contendo a lógica de negócio encapsulada, e um arquivo `serializers.py` validando os inputs específicos (ex: `LaborCalculationSerializer`, `BankingAmortizationSerializer`).
A saída de todo cálculo deve retornar o resumo financeiro E a `memória_de_calculo` (array de passos).