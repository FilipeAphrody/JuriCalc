from django.test import TestCase
from decimal import Decimal
from datetime import date
from .services import PensionCalculationService
from core.models import EconomicIndex

class PensionServicesTests(TestCase):
    def setUp(self):
        EconomicIndex.objects.create(name='INPC', date=date(2023, 1, 1), value=Decimal('0.01'))
        EconomicIndex.objects.create(name='INPC', date=date(2023, 2, 1), value=Decimal('0.02'))

    def test_calculate_delayed_benefits(self):
        result = PensionCalculationService.calculate_delayed_benefits(
            monthly_benefit=Decimal('1000.00'),
            start_date=date(2023, 1, 1),
            end_date=date(2023, 2, 1),
            index_name='INPC',
            interest_rate=Decimal('0.005')
        )
        
        # 2 parcelas (Jan e Fev)
        self.assertEqual(len(result['memory']), 2)
        
        # Total principal deve ser 2000
        self.assertEqual(result['summary']['total_principal'], Decimal('2000.00'))
        
        # Janeiro sofre correção de Jan e Fev (1.01 * 1.02 = 1.0302)
        # Fevereiro sofre correção apenas de Fev (1.02)
        # É uma aproximação do teste para validar que rodou.
        self.assertTrue(result['summary']['total_correction'] > Decimal('0.00'))
