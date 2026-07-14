from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from core.math_engine import apply_monetary_correction, calculate_interest

class PensionCalculationService:
    @staticmethod
    def calculate_delayed_benefits(
        monthly_benefit: Decimal,
        start_date: date,
        end_date: date,
        index_name: str = 'INPC',
        interest_rate: Decimal = Decimal('0.005')
    ) -> dict:
        """
        Cálculo de parcelas atrasadas de benefício previdenciário (INSS).
        Itera mês a mês a partir de start_date até end_date, aplicando
        correção monetária e juros para cada competência devida.
        """
        total_principal = Decimal('0')
        total_correction = Decimal('0')
        total_interest = Decimal('0')
        memory = []
        
        current_date = start_date.replace(day=1)
        end_date_limit = end_date.replace(day=1)
        step = 1
        
        while current_date <= end_date_limit:
            # Correção desta parcela até o fim do período
            corrected = apply_monetary_correction(monthly_benefit, index_name, current_date, end_date)
            correction = corrected - monthly_benefit
            
            # Juros desta parcela (juros simples contados mês a mês é a regra do manual do CJF)
            total_with_interest = calculate_interest(corrected, interest_rate, 'simple', current_date, end_date)
            interest = total_with_interest - corrected
            
            parcel_total = corrected + interest
            
            total_principal += monthly_benefit
            total_correction += correction
            total_interest += interest
            
            twoplaces = Decimal('0.01')
            memory.append({
                'step': step,
                'description': f"Competência {current_date.strftime('%m/%Y')}",
                'principal': monthly_benefit.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'correction': correction.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'interest': interest.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'total': parcel_total.quantize(twoplaces, rounding=ROUND_HALF_UP)
            })
            
            # Avança 1 mês
            if current_date.month == 12:
                current_date = current_date.replace(year=current_date.year + 1, month=1)
            else:
                current_date = current_date.replace(month=current_date.month + 1)
            step += 1
            
        twoplaces = Decimal('0.01')
        summary = {
            'total_principal': total_principal.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total_correction': total_correction.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total_interest': total_interest.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'final_total': (total_principal + total_correction + total_interest).quantize(twoplaces, rounding=ROUND_HALF_UP)
        }
        
        return {'summary': summary, 'memory': memory}
