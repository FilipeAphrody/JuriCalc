from django.test import TestCase
from decimal import Decimal
from datetime import date
from .services import CivilCalculationService
from core.models import EconomicIndex

class CivilServicesTests(TestCase):
    def setUp(self):
        # Create some indices for testing monetary correction
        EconomicIndex.objects.create(name='IPCA', date=date(2023, 1, 1), value=Decimal('0.01'))
        EconomicIndex.objects.create(name='IPCA', date=date(2023, 2, 1), value=Decimal('0.02'))

    def test_calculate_claim_general(self):
        result = CivilCalculationService.calculate_claim(
            principal=Decimal('1000.00'),
            start_date=date(2023, 1, 15),
            end_date=date(2023, 2, 15),
            index_name='IPCA',
            interest_rate=Decimal('0.01'),
            interest_type='simple',
            fine_percentage=Decimal('0.10'),
            fees_percentage=Decimal('0.10'),
            claim_type='debt'
        )
        
        # 1. Correção: 1000 * 1.01 * 1.02 = 1030.20
        self.assertEqual(result['summary']['corrected_principal'], Decimal('1030.20'))
        
        # 2. Juros: 1030.20 * 0.01 * 1 (mes) = 10.30
        self.assertEqual(result['summary']['interest_amount'], Decimal('10.30'))
        
        # 3. Multa: 1030.20 * 0.10 = 103.02
        self.assertEqual(result['summary']['fine_amount'], Decimal('103.02'))
        
        # Subtotal: 1030.20 + 10.30 + 103.02 = 1143.52
        
        # 4. Honorários: 1143.52 * 0.10 = 114.35
        self.assertEqual(result['summary']['fees_amount'], Decimal('114.35'))
        
        # 5. Total: 1143.52 + 114.35 = 1257.87
        self.assertEqual(result['summary']['total'], Decimal('1257.87'))
        self.assertEqual(len(result['memory']), 7)

    def test_calculate_claim_condo_limit(self):
        # Condomínio tem trava de 2% na multa
        result = CivilCalculationService.calculate_claim(
            principal=Decimal('1000.00'),
            start_date=date(2023, 1, 15),
            end_date=date(2023, 2, 15),
            index_name='IPCA',
            interest_rate=Decimal('0.01'),
            fine_percentage=Decimal('0.10'), # Tentando 10%
            claim_type='condo'
        )
        
        # Multa deve ser limitada a 2% sobre o corrigido (1030.20 * 0.02 = 20.60)
        self.assertEqual(result['summary']['fine_amount'], Decimal('20.60'))
