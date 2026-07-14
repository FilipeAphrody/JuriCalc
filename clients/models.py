from django.db import models
from users.models import Office

class Client(models.Model):
    CLIENT_TYPES = [
        ('PF', 'Pessoa Física'),
        ('PJ', 'Pessoa Jurídica'),
    ]
    
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='clients')
    type = models.CharField(max_length=2, choices=CLIENT_TYPES, default='PF')
    name = models.CharField(max_length=255)
    document_number = models.CharField(max_length=20, help_text="CPF ou CNPJ")
    contact_info = models.JSONField(default=dict, blank=True, help_text="Email, Telefone, Endereço, etc.")
    
    # Soft Delete
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Um cliente pode não ser único globalmente, mas é único por CNPJ/CPF dentro do mesmo escritório
        unique_together = ('office', 'document_number')
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

    def __str__(self):
        return f"{self.name} ({self.document_number})"
