from django.test import TestCase
from decimal import Decimal
from datetime import date
from .services import TaxCalculationService
from core.models import EconomicIndex

class TaxServicesTests(TestCase):
    def setUp(self):
        # Criação de taxas SELIC para o teste
        EconomicIndex.objects.create(name='SELIC', date=date(2023, 1, 1), value=Decimal('0.0100'))
        EconomicIndex.objects.create(name='SELIC', date=date(2023, 2, 1), value=Decimal('0.0050'))

    def test_calculate_restitution(self):
        result = TaxCalculationService.calculate_restitution(
            principal=Decimal('1000.00'),
            start_date=date(2023, 1, 15),
            end_date=date(2023, 2, 15),
            fine_percentage=Decimal('0.10')
        )
        
        # Soma da SELIC = 1% + 0.5% = 1.5% (0.015)
        # Rendimento SELIC = 1000 * 0.015 = 15.00
        # Principal Atualizado = 1015.00
        # Multa = 1015.00 * 0.10 = 101.50
        # Total = 1116.50
        
        self.assertEqual(result['summary']['selic_rate_accumulated'], Decimal('0.0150'))
        self.assertEqual(result['summary']['selic_amount'], Decimal('15.00'))
        self.assertEqual(result['summary']['fine_amount'], Decimal('101.50'))
        self.assertEqual(result['summary']['total'], Decimal('1116.50'))
