from decimal import Decimal, ROUND_HALF_UP
from datetime import date

class LaborCalculationService:
    @staticmethod
    def calculate_overtime(
        base_salary: Decimal,
        overtime_hours: Decimal,
        overtime_percentage: Decimal = Decimal('0.50'),
        work_hours_monthly: Decimal = Decimal('220.00'),
        work_days_month: int = 25,
        rest_days_month: int = 5
    ) -> dict:
        """
        Calcula as Horas Extras e seus principais reflexos nas verbas trabalhistas.
        Mapeamento essencial para a Justiça do Trabalho (CLT).
        """
        twoplaces = Decimal('0.01')
        
        # 1. Base da Hora
        normal_hour_value = base_salary / work_hours_monthly
        overtime_hour_value = normal_hour_value * (Decimal('1') + overtime_percentage)
        
        # 2. Total Principal (HE)
        total_overtime = overtime_hour_value * overtime_hours
        
        # 3. Reflexo no DSR (Descanso Semanal Remunerado)
        dsr_reflex = (total_overtime / Decimal(str(work_days_month))) * Decimal(str(rest_days_month))
        
        # 4. Reflexos em Verbas (Projeção Anual Média)
        # Em uma petição trabalhista real, projeta-se isso pelos meses trabalhados.
        # Aqui, criamos o bloco unitário de reflexo para o período de 1 ano para o MVP.
        base_reflexo = total_overtime + dsr_reflex
        aviso_reflex = base_reflexo
        décimo_terceiro_reflex = base_reflexo
        ferias_reflex = base_reflexo * Decimal('1.3333333') # Férias + 1/3
        
        # 5. FGTS (8%) e Multa Rescisória (40%)
        # Incidência: HE, DSR, Aviso e 13º. Férias indenizadas (em regra) não têm incidência de FGTS.
        fgts_base = total_overtime + dsr_reflex + aviso_reflex + décimo_terceiro_reflex
        fgts_value = fgts_base * Decimal('0.08')
        fgts_fine = fgts_value * Decimal('0.40')
        
        total_verbas = (total_overtime + dsr_reflex + aviso_reflex + 
                        décimo_terceiro_reflex + ferias_reflex + 
                        fgts_value + fgts_fine)
        
        summary = {
            'normal_hour_value': normal_hour_value.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'overtime_hour_value': overtime_hour_value.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total_overtime': total_overtime.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'dsr_reflex': dsr_reflex.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'aviso_reflex': aviso_reflex.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'décimo_terceiro_reflex': décimo_terceiro_reflex.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'vacation_reflex': ferias_reflex.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'fgts_value': fgts_value.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'fgts_fine': fgts_fine.quantize(twoplaces, rounding=ROUND_HALF_UP),
            'total_verbas': total_verbas.quantize(twoplaces, rounding=ROUND_HALF_UP),
        }
        
        memory = [
            {'step': 1, 'description': f'Horas Extras Principais ({overtime_hours}h a {overtime_percentage*100}%)', 'value': summary['total_overtime']},
            {'step': 2, 'description': 'Reflexo no DSR', 'value': summary['dsr_reflex']},
            {'step': 3, 'description': 'Reflexo no Aviso Prévio Indenizado', 'value': summary['aviso_reflex']},
            {'step': 4, 'description': 'Reflexo no 13º Salário', 'value': summary['décimo_terceiro_reflex']},
            {'step': 5, 'description': 'Reflexo nas Férias + 1/3', 'value': summary['vacation_reflex']},
            {'step': 6, 'description': 'FGTS (8%) sobre verbas', 'value': summary['fgts_value']},
            {'step': 7, 'description': 'Multa Rescisória (40% do FGTS)', 'value': summary['fgts_fine']},
            {'step': 8, 'description': 'Total Geral', 'value': summary['total_verbas']},
        ]
        
        return {
            'summary': summary,
            'memory': memory
        }
