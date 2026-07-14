from rest_framework import filters
from django.core.exceptions import PermissionDenied

class TenantFilterBackend(filters.BaseFilterBackend):
    """
    Filtro genérico para Isolamento de Tenant (Escritório).
    Garante automaticamente que qualquer QuerySet retornará apenas os 
    dados do Escritório informado no Header (office_id).
    """
    def filter_queryset(self, request, queryset, view):
        # Verifica se o Model que está sendo consultado possui o campo 'office_id'
        has_office = hasattr(queryset.model, 'office_id') or 'office_id' in [f.name for f in queryset.model._meta.get_fields()]
        
        if not has_office:
            # Se a tabela não for sensível (ex: Tipos de Cálculo globais), passa direto
            return queryset
            
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        
        if not office_id:
            # Se a tabela exige Tenant e o front-end não enviou o header, bloqueia imediatamente.
            raise PermissionDenied("Header X-Office-ID é obrigatório para acessar este recurso.")
            
        # Aplica o isolamento silenciosamente e a nível de banco de dados
        return queryset.filter(office_id=office_id)
