from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.db import transaction
from django.core.serializers.json import DjangoJSONEncoder
import json

from users.permissions import IsTenantLawyerOrAbove
from core.models import Calculation, CalculationVersion

# Imports dos Serializers
from engines.civil.serializers import CivilCalculationSerializer
from engines.tax.serializers import TaxCalculationSerializer
from engines.banking.serializers import BankingAmortizationSerializer
from engines.labor.serializers import OvertimeCalculationSerializer
from engines.pension.serializers import PensionDelayedSerializer
from engines.family.serializers import AlimonyArrearsSerializer

# Imports dos Services
from engines.civil.services import CivilCalculationService
from engines.tax.services import TaxCalculationService
from engines.banking.services import BankingCalculationService
from engines.labor.services import LaborCalculationService
from engines.pension.services import PensionCalculationService
from engines.family.services import FamilyCalculationService

class BaseEngineView(GenericAPIView):
    """
    Classe base que intercepta requisições de cálculos, 
    chama o Service matemático e salva os resultados imutáveis (CalculationVersion).
    """
    permission_classes = [IsAuthenticated, IsTenantLawyerOrAbove]
    engine_name = "unknown"

    def perform_calculation(self, validated_data):
        raise NotImplementedError()

    @extend_schema(
        parameters=[
            OpenApiParameter(name='X-Office-ID', type=str, location=OpenApiParameter.HEADER, required=True),
        ]
    )
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        
        with transaction.atomic():
            # Executa o cálculo matemático isolado
            result = self.perform_calculation(serializer.validated_data)
            
            # Lógica de Auditoria e Versionamento (Task 18)
            calc_id = request.data.get('calculation_id')
            if calc_id:
                # Nova versão de um cálculo existente
                calculation = Calculation.objects.get(id=calc_id, office_id=office_id)
            else:
                # Novo cálculo mãe
                title = request.data.get('title', f"Cálculo {self.engine_name}")
                calculation = Calculation.objects.create(
                    office_id=office_id,
                    engine=self.engine_name,
                    title=title,
                    client_id=request.data.get('client_id'),
                    lawsuit_id=request.data.get('lawsuit_id'),
                    created_by=request.user
                )
                
            next_version = calculation.versions.count() + 1
            
            # Usando DjangoJSONEncoder para lidar com Decimals e Datas
            input_json = json.loads(json.dumps(serializer.validated_data, cls=DjangoJSONEncoder))
            output_json = json.loads(json.dumps(result, cls=DjangoJSONEncoder))
            
            version = CalculationVersion.objects.create(
                calculation=calculation,
                version_number=next_version,
                input_data=input_json,
                output_data=output_json,
                created_by=request.user
            )
            
            # Retorna o resultado junto com metadados do BD
            response_data = {
                "meta": {
                    "calculation_id": calculation.id,
                    "version_number": version.version_number,
                    "version_id": version.id
                },
                "result": result
            }
            
            return Response(response_data, status=status.HTTP_200_OK)


class CivilCalculationView(BaseEngineView):
    serializer_class = CivilCalculationSerializer
    engine_name = "civil"

    def perform_calculation(self, validated_data):
        return CivilCalculationService.calculate_claim(**validated_data)

class TaxCalculationView(BaseEngineView):
    serializer_class = TaxCalculationSerializer
    engine_name = "tax"

    def perform_calculation(self, validated_data):
        return TaxCalculationService.calculate_restitution(**validated_data)

class BankingAmortizationView(BaseEngineView):
    serializer_class = BankingAmortizationSerializer
    engine_name = "banking"

    def perform_calculation(self, validated_data):
        return BankingCalculationService.generate_amortization_schedule(**validated_data)

class LaborOvertimeView(BaseEngineView):
    serializer_class = OvertimeCalculationSerializer
    engine_name = "labor"

    def perform_calculation(self, validated_data):
        return LaborCalculationService.calculate_overtime(**validated_data)

class PensionDelayedView(BaseEngineView):
    serializer_class = PensionDelayedSerializer
    engine_name = "pension"

    def perform_calculation(self, validated_data):
        return PensionCalculationService.calculate_delayed_benefits(**validated_data)

class FamilyAlimonyView(BaseEngineView):
    serializer_class = AlimonyArrearsSerializer
    engine_name = "family"

    def perform_calculation(self, validated_data):
        return FamilyCalculationService.calculate_alimony_arrears(**validated_data)
