import pytest
from core.models import Calculation, CalculationVersion, AuditLog
from users.models import CustomUser, Office, Plan

@pytest.mark.django_db
class TestCalculationAndAuditLog:
    def test_calculation_version_creates_audit_log_via_signal(self):
        user = CustomUser.objects.create_user(username="calcuser", email="calc@lexcalc.com", password="securepassword")
        plan = Plan.objects.create(name="Basic", price=0.00, features={"max_users": 1})
        office = Office.objects.create(name="Office Test", plan=plan)
        
        calc = Calculation.objects.create(
            office=office,
            title="Cálculo Inicial",
            engine="civil",
            created_by=user
        )
        
        # O AuditLog deve estar vazio inicialmente
        assert AuditLog.objects.count() == 0
        
        # Ao criar uma versão, o Signal post_save deve gerar um AuditLog
        version = CalculationVersion.objects.create(
            calculation=calc,
            version_number=1,
            input_data={"principal": 1000},
            output_data={"total": 1100},
            created_by=user
        )
        
        assert AuditLog.objects.count() == 1
        log = AuditLog.objects.first()
        
        # Verificar integridade da auditoria
        assert log.calculation_version == version
        assert "calc@lexcalc.com" in log.details
        assert "Cálculo Inicial" in log.details
        assert "civil" in log.details
        assert log.action == f"Cálculo Gerado: Versão {version.version_number}"
