from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Lawsuit
from .serializers import LawsuitSerializer
from core.filters import TenantFilterBackend
from users.permissions import IsTenantLawyerOrAbove
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

class LawsuitViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Processos Judiciais (Lawsuits). 
    Protegido pelo TenantFilterBackend (isolamento de dados).
    """
    serializer_class = LawsuitSerializer
    permission_classes = [IsAuthenticated, IsTenantLawyerOrAbove]
    filter_backends = [TenantFilterBackend, DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'client_id']
    search_fields = ['cnj_number', 'client__name']
    ordering_fields = ['created_at']
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name='X-Office-ID', type=str, location=OpenApiParameter.HEADER, description='ID do Escritório Contextual', required=True),
        ]
    )
    def get_queryset(self):
        # Retorna apenas processos que não foram deletados logicamente
        return Lawsuit.objects.filter(deleted_at__isnull=True)
        
    def perform_destroy(self, instance):
        # Soft Delete
        instance.deleted_at = timezone.now()
        instance.save()
