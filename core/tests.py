from django.test import TestCase
from decimal import Decimal
from datetime import date
from core.math_engine import amortization_price, amortization_sac, calculate_interest, apply_monetary_correction
from core.models import EconomicIndex

class MathEngineTests(TestCase):
    def test_amortization_price(self):
        principal = Decimal('1000.00')
        rate = Decimal('0.01') # 1%
        periods = 10
        
        schedule = amortization_price(principal, rate, periods)
        self.assertEqual(len(schedule), 10)
        
        # Check first period
        # PMT = 1000 * 0.01 / (1 - 1.01^-10) = 105.58
        self.assertEqual(schedule[0]['period'], 1)
        self.assertEqual(schedule[0]['installment'], Decimal('105.58'))
        self.assertEqual(schedule[0]['interest'], Decimal('10.00'))
        self.assertEqual(schedule[0]['amortization'], Decimal('95.58'))
        self.assertEqual(schedule[0]['balance'], Decimal('904.42'))
        
        # Check last period balance is very close to 0
        self.assertEqual(schedule[-1]['balance'], Decimal('0.00'))

    def test_amortization_sac(self):
        principal = Decimal('1000.00')
        rate = Decimal('0.01') # 1%
        periods = 10
        
        schedule = amortization_sac(principal, rate, periods)
        self.assertEqual(len(schedule), 10)
        
        # Check first period
        self.assertEqual(schedule[0]['period'], 1)
        self.assertEqual(schedule[0]['installment'], Decimal('110.00'))
        self.assertEqual(schedule[0]['interest'], Decimal('10.00'))
        self.assertEqual(schedule[0]['amortization'], Decimal('100.00'))
        self.assertEqual(schedule[0]['balance'], Decimal('900.00'))
        
        # Check last period balance is 0
        self.assertEqual(schedule[-1]['balance'], Decimal('0.00'))

    def test_calculate_interest_simple(self):
        value = Decimal('1000.00')
        rate = Decimal('0.01')
        start_date = date(2023, 1, 1)
        end_date = date(2023, 11, 1) # 10 months
        
        # 1000 * (1 + 0.01 * 10) = 1100
        result = calculate_interest(value, rate, 'simple', start_date, end_date)
        self.assertEqual(result, Decimal('1100.00'))

    def test_calculate_interest_compound(self):
        value = Decimal('1000.00')
        rate = Decimal('0.01')
        start_date = date(2023, 1, 1)
        end_date = date(2023, 3, 1) # 2 months
        
        # 1000 * (1.01)^2 = 1020.1
        result = calculate_interest(value, rate, 'compound', start_date, end_date)
        self.assertEqual(result.quantize(Decimal('0.01')), Decimal('1020.10'))

    def test_apply_monetary_correction(self):
        EconomicIndex.objects.create(name='IPCA', date=date(2023, 1, 1), value=Decimal('0.01'))
        EconomicIndex.objects.create(name='IPCA', date=date(2023, 2, 1), value=Decimal('0.02'))
        
        value = Decimal('1000.00')
        start_date = date(2023, 1, 15)
        end_date = date(2023, 2, 15)
        
        # 1000 * 1.01 * 1.02 = 1030.2
        result = apply_monetary_correction(value, 'IPCA', start_date, end_date)
        self.assertEqual(result.quantize(Decimal('0.01')), Decimal('1030.20'))
