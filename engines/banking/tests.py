from django.test import TestCase
from decimal import Decimal
from .services import BankingCalculationService

class BankingServicesTests(TestCase):
    def test_generate_price(self):
        result = BankingCalculationService.generate_amortization_schedule(
            principal=Decimal('1000.00'),
            rate=Decimal('0.01'),
            periods=10,
            system='PRICE'
        )
        self.assertEqual(result['summary']['system'], 'PRICE')
        self.assertEqual(len(result['memory']), 10)
        self.assertEqual(result['memory'][0]['installment'], Decimal('105.58'))
        
        # O total pago deve ser a soma das parcelas (10 * 105.58 approx = 1055.82)
        self.assertTrue(result['summary']['total_paid'] > Decimal('1000.00'))

    def test_generate_sac(self):
        result = BankingCalculationService.generate_amortization_schedule(
            principal=Decimal('1000.00'),
            rate=Decimal('0.01'),
            periods=10,
            system='SAC'
        )
        self.assertEqual(result['summary']['system'], 'SAC')
        self.assertEqual(len(result['memory']), 10)
        self.assertEqual(result['memory'][0]['installment'], Decimal('110.00'))
        
        # A última parcela do SAC é 101.00 (Amort 100 + 1 de juros sobre os 100 finais)
        self.assertEqual(result['memory'][-1]['installment'], Decimal('101.00'))
        
    def test_generate_sacre(self):
        result = BankingCalculationService.generate_amortization_schedule(
            principal=Decimal('1000.00'),
            rate=Decimal('0.01'),
            periods=10,
            system='SACRE'
        )
        self.assertEqual(result['summary']['system'], 'SACRE')
