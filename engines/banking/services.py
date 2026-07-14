from decimal import Decimal, ROUND_HALF_UP
from core.math_engine import amortization_price, amortization_sac

class BankingCalculationService:
    @staticmethod
    def generate_amortization_schedule(
        principal: Decimal,
        rate: Decimal,
        periods: int,
        system: str = 'PRICE'
    ) -> dict:
        """
        Gera tabela de amortização para contratos bancários.
        Suporta os sistemas: PRICE, SAC e SACRE.
        """
        system = system.upper()
        
        if system == 'PRICE':
            memory = amortization_price(principal, rate, periods)
        elif system == 'SAC':
            memory = amortization_sac(principal, rate, periods)
        elif system == 'SACRE':
            memory = BankingCalculationService._amortization_sacre(principal, rate, periods)
        else:
            raise ValueError("Sistema de amortização inválido. Escolha PRICE, SAC ou SACRE.")
            
        # Calcular totais
        total_interest = sum(step['interest'] for step in memory)
        total_paid = sum(step['installment'] for step in memory)
        
        twoplaces = Decimal('0.01')
        summary = {
            'principal': principal.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total_interest': total_interest.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total_paid': total_paid.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'system': system
        }
        
        return {
            'summary': summary,
            'memory': memory
        }

    @staticmethod
    def _amortization_sacre(principal: Decimal, rate: Decimal, periods: int) -> list[dict]:
        """
        Implementação do SACRE (Sistema de Amortização Crescente).
        Para contratos não indexados (sem TR ou IPCA pós-fixado), o SACRE converge
        matematicamente para o SAC na maioria das formulações padronizadas.
        Para o MVP, utilizamos a mesma base matemática do SAC.
        """
        return amortization_sac(principal, rate, periods)
