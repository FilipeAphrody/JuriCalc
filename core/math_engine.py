from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from .models import EconomicIndex

def apply_monetary_correction(value: Decimal, index_name: str, start_date: date, end_date: date) -> Decimal:
    """
    Applies monetary correction based on EconomicIndex values between start_date and end_date.
    Assumes index.value is a decimal percentage (e.g., 0.01 for 1%).
    """
    # Get all indices for the given name between start_date and end_date
    indices = EconomicIndex.objects.filter(
        name=index_name,
        date__gte=start_date.replace(day=1),
        date__lte=end_date.replace(day=1)
    ).order_by('date')
    
    factor = Decimal('1')
    for index in indices:
        factor *= (Decimal('1') + index.value)
        
    return value * factor

def months_between(start_date: date, end_date: date) -> int:
    return (end_date.year - start_date.year) * 12 + end_date.month - start_date.month

def calculate_interest(value: Decimal, rate: Decimal, interest_type: str, start_date: date, end_date: date) -> Decimal:
    """
    Calculates simple or compound interest over the months between start_date and end_date.
    Returns the total value (principal + interest).
    """
    months = Decimal(str(months_between(start_date, end_date)))
    if months <= 0:
        return value
        
    if interest_type == 'simple':
        return value * (Decimal('1') + (rate * months))
    elif interest_type == 'compound':
        return value * ((Decimal('1') + rate) ** months)
    else:
        raise ValueError("interest_type must be 'simple' ou 'compound'")

def amortization_price(principal: Decimal, rate: Decimal, periods: int) -> list[dict]:
    """
    Generates a Price amortization schedule.
    """
    if rate == 0:
        installment = principal / periods
    else:
        installment = (principal * rate) / (Decimal('1') - (Decimal('1') + rate) ** -periods)
    
    balance = principal
    schedule = []
    
    for p in range(1, periods + 1):
        interest = balance * rate
        amortization = installment - interest
        balance -= amortization
        
        schedule.append({
            'period': p,
            'installment': installment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            'interest': interest.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            'amortization': amortization.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            'balance': balance.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        })
    return schedule

def amortization_sac(principal: Decimal, rate: Decimal, periods: int) -> list[dict]:
    """
    Generates a SAC amortization schedule.
    """
    amortization = principal / Decimal(str(periods))
    balance = principal
    schedule = []
    
    for p in range(1, periods + 1):
        interest = balance * rate
        installment = amortization + interest
        balance -= amortization
        
        schedule.append({
            'period': p,
            'installment': installment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            'interest': interest.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            'amortization': amortization.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            'balance': balance.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        })
    return schedule
