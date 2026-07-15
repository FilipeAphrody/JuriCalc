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

from users.models import Office, CustomUser
from clients.models import Client
from lawsuits.models import Lawsuit

class Calculation(models.Model):
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='calculations')
    client = models.ForeignKey(Client, null=True, blank=True, on_delete=models.SET_NULL, related_name='calculations')
    lawsuit = models.ForeignKey(Lawsuit, null=True, blank=True, on_delete=models.SET_NULL, related_name='calculations')
    created_by = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL, related_name='created_calculations')
    
    engine = models.CharField(max_length=50, help_text="Motor utilizado (ex: 'labor', 'civil')")
    title = models.CharField(max_length=255)
    
    # Soft Delete e Timestamps
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Cálculo"
        verbose_name_plural = "Cálculos"
        
    def __str__(self):
        return f"{self.title} ({self.engine})"

class CalculationVersion(models.Model):
    calculation = models.ForeignKey(Calculation, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField(default=1)
    
    # Snapshot imutável de entrada e saída
    input_data = models.JSONField(help_text="Parâmetros exatos que geraram este resultado")
    output_data = models.JSONField(help_text="Resultado financeiro exato na época")
    
    created_by = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL, related_name='created_versions')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('calculation', 'version_number')
        verbose_name = "Versão de Cálculo"
        verbose_name_plural = "Versões de Cálculo"

    def __str__(self):
        return f"{self.calculation.title} - v{self.version_number}"

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

