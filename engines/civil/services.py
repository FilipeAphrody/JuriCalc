from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from core.math_engine import apply_monetary_correction, calculate_interest

class CivilCalculationService:
    @staticmethod
    def calculate_claim(
        principal: Decimal,
        start_date: date,
        end_date: date,
        index_name: str,
        interest_rate: Decimal,
        interest_type: str = 'simple',
        fine_percentage: Decimal = Decimal('0.00'),
        fees_percentage: Decimal = Decimal('0.00'),
        claim_type: str = 'debt'
    ) -> dict:
        """
        Realiza cálculo civil abrangendo atualização, juros, multas e honorários.
        Suporta os domínios: Dívidas Comuns, Execução, Aluguel e Condomínio.
        Retorna o resumo financeiro e a memória de cálculo (passo a passo).
        """
        # 1. Correção Monetária
        corrected_principal = apply_monetary_correction(principal, index_name, start_date, end_date)
        correction_amount = corrected_principal - principal
        
        # 2. Juros (aplicados sobre o valor corrigido, regra padrão no direito civil)
        total_with_interest = calculate_interest(corrected_principal, interest_rate, interest_type, start_date, end_date)
        interest_amount = total_with_interest - corrected_principal
        
        # 3. Multa (sobre o principal corrigido)
        # Regra de negócio: Condomínio tem trava legal de 2% (Art. 1336, § 1º, CC)
        if claim_type == 'condo' and fine_percentage > Decimal('0.02'):
            fine_percentage = Decimal('0.02')
            
        fine_amount = corrected_principal * fine_percentage
        
        # 4. Subtotal (Principal Corrigido + Juros + Multa)
        subtotal = corrected_principal + interest_amount + fine_amount
        
        # 5. Honorários Advocatícios (geralmente sobre o subtotal)
        fees_amount = subtotal * fees_percentage
        
        # 6. Total
        total = subtotal + fees_amount
        
        # Formatação para 2 casas decimais (moeda corrente)
        twoplaces = Decimal('0.01')
        
        summary = {
            'principal': principal.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'correction_amount': correction_amount.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'corrected_principal': corrected_principal.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'interest_amount': interest_amount.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'fine_amount': fine_amount.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'fees_amount': fees_amount.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total': total.quantize(twoplaces, rounding=ROUND_HALF_UP),
        }
        
        memory = [
            {'step': 1, 'description': 'Valor Original', 'value': summary['principal']},
            {'step': 2, 'description': f'Correção Monetária ({index_name})', 'value': summary['correction_amount']},
            {'step': 3, 'description': 'Principal Corrigido', 'value': summary['corrected_principal']},
            {'step': 4, 'description': f'Juros ({interest_type}) a {interest_rate*100}% a.m.', 'value': summary['interest_amount']},
            {'step': 5, 'description': f'Multa ({fine_percentage*100}%)', 'value': summary['fine_amount']},
            {'step': 6, 'description': f'Honorários ({fees_percentage*100}%)', 'value': summary['fees_amount']},
            {'step': 7, 'description': 'Total Devido', 'value': summary['total']},
        ]
        
        return {
            'summary': summary,
            'memory': memory
        }
