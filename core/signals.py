from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CalculationVersion, AuditLog

@receiver(post_save, sender=CalculationVersion)
def create_audit_log(sender, instance, created, **kwargs):
    """
    Sempre que uma nova Versão de Cálculo (CalculationVersion) for criada no banco,
    este Signal é disparado automaticamente para gerar um rastro de auditoria (AuditLog).
    """
    if created:
        user_info = instance.created_by.email if instance.created_by else "Sistema/API"
        action = f"Cálculo Gerado: Versão {instance.version_number}"
        details = (
            f"O usuário [{user_info}] gerou uma nova versão para o cálculo "
            f"'{instance.calculation.title}' usando o motor '{instance.calculation.engine}'."
        )
        
        AuditLog.objects.create(
            calculation_version=instance,
            action=action,
            details=details
        )
