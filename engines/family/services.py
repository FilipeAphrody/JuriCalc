from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from core.math_engine import apply_monetary_correction, calculate_interest

class FamilyCalculationService:
    @staticmethod
    def calculate_alimony_arrears(
        monthly_alimony: Decimal,
        start_date: date,
        end_date: date,
        index_name: str = 'INPC',
        interest_rate: Decimal = Decimal('0.01'),
        fine_percentage: Decimal = Decimal('0.10')
    ) -> dict:
        """
        Cálculo de pensão alimentícia em atraso.
        Itera mês a mês a partir de start_date até end_date, aplicando
        correção, juros mensais e, no final, a multa do Art. 523 do CPC sobre o total.
        (A multa pode incidir sobre cada parcela ou sobre o total, aqui aplicamos parcela a parcela para compor a memória)
        """
        total_principal = Decimal('0')
        total_correction = Decimal('0')
        total_interest = Decimal('0')
        total_fine = Decimal('0')
        memory = []
        
        current_date = start_date.replace(day=1)
        end_date_limit = end_date.replace(day=1)
        step = 1
        
        while current_date <= end_date_limit:
            corrected = apply_monetary_correction(monthly_alimony, index_name, current_date, end_date)
            correction = corrected - monthly_alimony
            
            total_with_interest = calculate_interest(corrected, interest_rate, 'simple', current_date, end_date)
            interest = total_with_interest - corrected
            
            # Multa de 10% (Art 523) incide sobre o valor corrigido + juros
            fine = (corrected + interest) * fine_percentage
            
            parcel_total = corrected + interest + fine
            
            total_principal += monthly_alimony
            total_correction += correction
            total_interest += interest
            total_fine += fine
            
            twoplaces = Decimal('0.01')
            memory.append({
                'step': step,
                'description': f"Parcela Alimentícia {current_date.strftime('%m/%Y')}",
                'principal': monthly_alimony.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'correction': correction.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'interest': interest.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'fine': fine.quantize(twoplaces, rounding=ROUND_HALF_UP),
                'total': parcel_total.quantize(twoplaces, rounding=ROUND_HALF_UP)
            })
            
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
            'total_fine': total_fine.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'final_total': (total_principal + total_correction + total_interest + total_fine).quantize(twoplaces, rounding=ROUND_HALF_UP)
        }
        
        return {'summary': summary, 'memory': memory}
