from django.db import models
from users.models import Office
from clients.models import Client

class Lawsuit(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Ativo'),
        ('ARCHIVED', 'Arquivado'),
        ('SUSPENDED', 'Suspenso'),
    ]
    
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='lawsuits')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='lawsuits')
    
    cnj_number = models.CharField(max_length=50, db_index=True, help_text="Número unificado do CNJ")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Campo JSON para permitir máxima flexibilidade (Vara, Tribunal, Classe Processual, etc)
    metadata = models.JSONField(default=dict, blank=True, help_text="Informações adicionais do processo")
    
    # Soft Delete
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Processo"
        verbose_name_plural = "Processos"
        # O mesmo número CNJ não deve ser duplicado no mesmo escritório
        unique_together = ('office', 'cnj_number')

    def __str__(self):
        return f"{self.cnj_number} - {self.client.name}"
