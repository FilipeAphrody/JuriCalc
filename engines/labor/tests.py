from django.test import TestCase
from decimal import Decimal
from .services import LaborCalculationService

class LaborServicesTests(TestCase):
    def test_calculate_overtime(self):
        result = LaborCalculationService.calculate_overtime(
            base_salary=Decimal('2200.00'), # Hora Normal = 10 BRL
            overtime_hours=Decimal('10.00'),
            overtime_percentage=Decimal('0.50'),
            work_hours_monthly=Decimal('220.00'),
            work_days_month=25,
            rest_days_month=5
        )
        
        # Cálculos Esperados:
        # Hora Normal = 10.00
        # Hora Extra = 15.00
        # Total HE = 150.00
        self.assertEqual(result['summary']['normal_hour_value'], Decimal('10.00'))
        self.assertEqual(result['summary']['overtime_hour_value'], Decimal('15.00'))
        self.assertEqual(result['summary']['total_overtime'], Decimal('150.00'))
        
        # Reflexo DSR: (150 / 25) * 5 = 30.00
        self.assertEqual(result['summary']['dsr_reflex'], Decimal('30.00'))
        
        # Base de Reflexo: 180.00 (HE + DSR)
        # Férias Reflexo: 180.00 * 1.3333333 = 240.00
        self.assertEqual(result['summary']['vacation_reflex'], Decimal('240.00'))
        
        # Base FGTS: 150(HE) + 30(DSR) + 180(Aviso) + 180(13o) = 540
        # FGTS 8%: 540 * 0.08 = 43.20
        self.assertEqual(result['summary']['fgts_value'], Decimal('43.20'))
        
        # Multa FGTS 40%: 43.20 * 0.40 = 17.28
        self.assertEqual(result['summary']['fgts_fine'], Decimal('17.28'))
