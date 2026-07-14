from rest_framework.permissions import BasePermission
from .models import Membership

class IsGlobalAdmin(BasePermission):
    """
    Permite acesso apenas a administradores globais (Superusers do SaaS).
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_global_admin)

class BaseTenantPermission(BasePermission):
    """
    Classe base para verificar papéis dentro de um Escritório (Tenant).
    Exige que o header X-Office-ID seja enviado pelo Front-End.
    """
    def get_membership(self, request):
        if not request.user or not request.user.is_authenticated:
            return None
        
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        if not office_id:
            return None
            
        try:
            # Em sistemas de alta carga, podemos usar select_related('role') 
            # ou armazenar isso no cache/JWT claims.
            return Membership.objects.select_related('role').get(user=request.user, office_id=office_id)
        except Membership.DoesNotExist:
            return None

class IsTenantMember(BaseTenantPermission):
    """
    Garante que o usuário pertence ao escritório informado no header.
    """
    def has_permission(self, request, view):
        return self.get_membership(request) is not None

class IsTenantOwner(BaseTenantPermission):
    """
    Garante que o usuário é o Owner (Dono/Gestor) do escritório.
    """
    def has_permission(self, request, view):
        membership = self.get_membership(request)
        return bool(membership and membership.role.name.lower() == 'owner')

class IsTenantLawyerOrAbove(BaseTenantPermission):
    """
    Garante que o usuário tem permissões de Advogado (ou Owner).
    """
    def has_permission(self, request, view):
        membership = self.get_membership(request)
        if not membership:
            return False
        role_name = membership.role.name.lower()
        return role_name in ['owner', 'lawyer']
