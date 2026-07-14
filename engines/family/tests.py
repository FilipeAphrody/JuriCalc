from django.test import TestCase
from decimal import Decimal
from datetime import date
from .services import FamilyCalculationService
from core.models import EconomicIndex

class FamilyServicesTests(TestCase):
    def setUp(self):
        EconomicIndex.objects.create(name='INPC', date=date(2023, 1, 1), value=Decimal('0.01'))
        EconomicIndex.objects.create(name='INPC', date=date(2023, 2, 1), value=Decimal('0.02'))

    def test_calculate_alimony_arrears(self):
        result = FamilyCalculationService.calculate_alimony_arrears(
            monthly_alimony=Decimal('1000.00'),
            start_date=date(2023, 1, 1),
            end_date=date(2023, 2, 1),
            index_name='INPC',
            interest_rate=Decimal('0.01'),
            fine_percentage=Decimal('0.10')
        )
        
        # 2 parcelas (Jan e Fev)
        self.assertEqual(len(result['memory']), 2)
        
        # Total principal deve ser 2000
        self.assertEqual(result['summary']['total_principal'], Decimal('2000.00'))
        
        # Multa deve ser calculada (aproximadamente 10% de > 2000 = > 200)
        self.assertTrue(result['summary']['total_fine'] > Decimal('200.00'))
