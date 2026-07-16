from django.urls import path, include
from users.views import RegisterView, CustomTokenObtainPairView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import (
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
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    
    # Recuperação de Senha
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

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
