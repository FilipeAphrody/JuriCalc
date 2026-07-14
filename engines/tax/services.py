from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from core.models import EconomicIndex

class TaxCalculationService:
    @staticmethod
    def calculate_restitution(
        principal: Decimal,
        start_date: date,
        end_date: date,
        fine_percentage: Decimal = Decimal('0.00')
    ) -> dict:
        """
        Cálculo de repetição de indébito ou restituição tributária usando a taxa SELIC.
        No direito tributário brasileiro, a SELIC engloba tanto juros quanto correção monetária,
        e é calculada pela soma simples (acumulação simples) das taxas mensais.
        """
        # Obter índices SELIC no período
        indices = EconomicIndex.objects.filter(
            name='SELIC',
            date__gte=start_date.replace(day=1),
            date__lte=end_date.replace(day=1)
        ).order_by('date')
        
        # Acumulação simples (soma) das taxas SELIC
        accumulated_selic = sum((index.value for index in indices), Decimal('0.00'))
        
        # Cálculo dos valores
        selic_amount = principal * accumulated_selic
        corrected_principal = principal + selic_amount
        
        fine_amount = corrected_principal * fine_percentage
        total = corrected_principal + fine_amount
        
        # Formatação
        twoplaces = Decimal('0.01')
        
        summary = {
            'principal': principal.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'selic_rate_accumulated': accumulated_selic,
            'selic_amount': selic_amount.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'fine_amount': fine_amount.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total': total.quantize(twoplaces, rounding=ROUND_HALF_UP),
        }
        
        memory = [
            {'step': 1, 'description': 'Principal (Valor Histórico)', 'value': summary['principal']},
            {'step': 2, 'description': f'Atualização SELIC ({accumulated_selic*100}%)', 'value': summary['selic_amount']},
            {'step': 3, 'description': f'Multa ({fine_percentage*100}%)', 'value': summary['fine_amount']},
            {'step': 4, 'description': 'Total a Restituir/Compensar', 'value': summary['total']},
        ]
        
        return {
            'summary': summary,
            'memory': memory
        }
