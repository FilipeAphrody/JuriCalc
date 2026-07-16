from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Campos customizados SaaS
    is_global_admin = models.BooleanField(default=False, help_text="Designates whether this user has full cross-tenant access.")
    two_factor_enabled = models.BooleanField(default=False)
    
    # Exigir email único e usar como login principal (opcional, AbstractUser já tem username mas podemos forçar uso do email)
    email = models.EmailField('email address', unique=True)
    
    # Opcionalmente poderíamos setar USERNAME_FIELD = 'email', 
    # mas para manter compatibilidade máxima com o admin default, mantemos 'username'.

    def __str__(self):
        return self.email or self.username

class Plan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    features = models.JSONField(default=dict, help_text="Limites e permissões do plano (ex: max_users)")
    
    class Meta:
        verbose_name = "Plano"
        verbose_name_plural = "Planos"
        
    def __str__(self):
        return self.name

class Office(models.Model):
    name = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=20, unique=True, null=True, blank=True, help_text="CNPJ do Escritório")
    plan = models.ForeignKey(Plan, on_delete=models.RESTRICT, related_name='offices')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Escritório (Tenant)"
        verbose_name_plural = "Escritórios (Tenants)"
        
    def __str__(self):
        return f"{self.name} - {self.cnpj}"

class Role(models.Model):
    name = models.CharField(max_length=50, help_text="Ex: Owner, Lawyer, Assistant, Expert")
    permissions = models.JSONField(default=dict, help_text="Lista de permissões específicas")
    
    class Meta:
        verbose_name = "Papel (Role)"
        verbose_name_plural = "Papéis (Roles)"
        
    def __str__(self):
        return self.name

class Membership(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='memberships')
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='members')
    role = models.ForeignKey(Role, on_delete=models.RESTRICT)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'office')
        verbose_name = "Vínculo (Membership)"
        verbose_name_plural = "Vínculos (Memberships)"
        
    def __str__(self):
        return f"{self.user.email} - {self.office.name} ({self.role.name})"
