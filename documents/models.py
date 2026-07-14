from django.db import models
from users.models import Office, CustomUser
from clients.models import Client
from lawsuits.models import Lawsuit

class Document(models.Model):
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='documents')
    
    # Pode ser atrelado a um cliente e/ou a um processo
    client = models.ForeignKey(Client, null=True, blank=True, on_delete=models.SET_NULL, related_name='documents')
    lawsuit = models.ForeignKey(Lawsuit, null=True, blank=True, on_delete=models.SET_NULL, related_name='documents')
    
    file = models.FileField(upload_to='documents/%Y/%m/', help_text="Arquivo físico")
    filename = models.CharField(max_length=255, help_text="Nome original do arquivo")
    
    uploaded_by = models.ForeignKey(CustomUser, null=True, on_delete=models.SET_NULL, related_name='uploaded_documents')
    tags = models.JSONField(default=list, blank=True, help_text="Ex: ['Contrato', 'Procuração']")
    
    # Soft Delete
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Documento"
        verbose_name_plural = "Documentos"

    def __str__(self):
        return self.filename
