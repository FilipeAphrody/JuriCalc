from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

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

class CivilCalculationView(GenericAPIView):
    serializer_class = CivilCalculationSerializer

    @extend_schema(request=CivilCalculationSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = CivilCalculationService.calculate_claim(**serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaxCalculationView(GenericAPIView):
    serializer_class = TaxCalculationSerializer

    @extend_schema(request=TaxCalculationSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = TaxCalculationService.calculate_restitution(**serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BankingAmortizationView(GenericAPIView):
    serializer_class = BankingAmortizationSerializer

    @extend_schema(request=BankingAmortizationSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = BankingCalculationService.generate_amortization_schedule(**serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LaborOvertimeView(GenericAPIView):
    serializer_class = OvertimeCalculationSerializer

    @extend_schema(request=OvertimeCalculationSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = LaborCalculationService.calculate_overtime(**serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PensionDelayedView(GenericAPIView):
    serializer_class = PensionDelayedSerializer

    @extend_schema(request=PensionDelayedSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = PensionCalculationService.calculate_delayed_benefits(**serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FamilyAlimonyView(GenericAPIView):
    serializer_class = AlimonyArrearsSerializer

    @extend_schema(request=AlimonyArrearsSerializer)
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = FamilyCalculationService.calculate_alimony_arrears(**serializer.validated_data)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
