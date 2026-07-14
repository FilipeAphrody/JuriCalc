from django.db import models

class EconomicIndex(models.Model):
    name = models.CharField(max_length=50, help_text="Ex: IPCA, INPC, SELIC")
    date = models.DateField()
    value = models.DecimalField(max_digits=15, decimal_places=8, help_text="Valor do índice no mês")

    class Meta:
        unique_together = ('name', 'date')
        verbose_name = "Índice Econômico"
        verbose_name_plural = "Índices Econômicos"

    def __str__(self):
        return f"{self.name} - {self.date.strftime('%m/%Y')} - {self.value}"

class CalculationVersion(models.Model):
    domain = models.CharField(max_length=50, help_text="Domínio do cálculo (civil, trabalhista, etc)")
    version_number = models.IntegerField(default=1)
    input_data = models.JSONField()
    output_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Versão de Cálculo"
        verbose_name_plural = "Versões de Cálculo"

    def __str__(self):
        return f"Cálculo {self.domain} v{self.version_number} - {self.id}"

class AuditLog(models.Model):
    calculation_version = models.ForeignKey(CalculationVersion, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    class Meta:
        verbose_name = "Log de Auditoria"
        verbose_name_plural = "Logs de Auditoria"

    def __str__(self):
        return f"{self.action} em {self.calculation_version} ({self.timestamp})"

