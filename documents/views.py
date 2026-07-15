from rest_framework import viewsets, parsers, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Document
from .serializers import DocumentSerializer
from core.filters import TenantFilterBackend
from users.permissions import IsTenantLawyerOrAbove
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

class DocumentViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para Documentos com suporte a Upload de Arquivos.
    Protegido pelo TenantFilterBackend.
    """
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated, IsTenantLawyerOrAbove]
    filter_backends = [TenantFilterBackend, DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['client_id', 'lawsuit_id']
    search_fields = ['filename', 'tags']
    ordering_fields = ['created_at']
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name='X-Office-ID', type=str, location=OpenApiParameter.HEADER, description='ID do Escritório Contextual', required=True),
        ]
    )
    def get_queryset(self):
        # Retorna apenas documentos que não foram deletados
        return Document.objects.filter(deleted_at__isnull=True)
        
    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.save()
