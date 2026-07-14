from django.urls import path
from .views import (
    CivilCalculationView,
    TaxCalculationView,
    BankingAmortizationView,
    LaborOvertimeView,
    PensionDelayedView,
    FamilyAlimonyView
)

urlpatterns = [
    path('civil/calculate/', CivilCalculationView.as_view(), name='civil-calculate'),
    path('tax/calculate/', TaxCalculationView.as_view(), name='tax-calculate'),
    path('banking/amortization/', BankingAmortizationView.as_view(), name='banking-amortization'),
    path('labor/overtime/', LaborOvertimeView.as_view(), name='labor-overtime'),
    path('pension/delayed/', PensionDelayedView.as_view(), name='pension-delayed'),
    path('family/alimony/', FamilyAlimonyView.as_view(), name='family-alimony'),
]
