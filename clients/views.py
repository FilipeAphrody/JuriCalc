from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Client
from .serializers import ClientSerializer
from core.filters import TenantFilterBackend
from users.permissions import IsTenantLawyerOrAbove
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

class ClientViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Clientes. 
    Protegido pelo TenantFilterBackend (isolamento de dados).
    """
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated, IsTenantLawyerOrAbove]
    filter_backends = [TenantFilterBackend, DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['name', 'document_number']
    ordering_fields = ['name', 'created_at']
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name='X-Office-ID', type=str, location=OpenApiParameter.HEADER, description='ID do Escritório Contextual', required=True),
        ]
    )
    def get_queryset(self):
        # Retorna apenas clientes que não foram deletados logicamente
        return Client.objects.filter(deleted_at__isnull=True)
        
    def perform_destroy(self, instance):
        # Soft Delete ao invés de DELETE real
        instance.deleted_at = timezone.now()
        instance.save()
