from django.urls import path, include
from users.views import RegisterView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    CivilCalculationView,
    TaxCalculationView,
    BankingAmortizationView,
    LaborOvertimeView,
    PensionDelayedView,
    FamilyAlimonyView
)

urlpatterns = [
    # Autenticação JWT
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),

    # Endpoints de Cálculo
    path('civil/calculate/', CivilCalculationView.as_view(), name='civil-calculate'),
    path('tax/calculate/', TaxCalculationView.as_view(), name='tax-calculate'),
    path('banking/amortization/', BankingAmortizationView.as_view(), name='banking-amortization'),
    path('labor/overtime/', LaborOvertimeView.as_view(), name='labor-overtime'),
    path('pension/delayed/', PensionDelayedView.as_view(), name='pension-delayed'),
    path('family/alimony/', FamilyAlimonyView.as_view(), name='family-alimony'),
    
    # Módulos de Gestão Core
    path('clients/', include('clients.urls')),
    path('lawsuits/', include('lawsuits.urls')),
    path('documents/', include('documents.urls')),
]
