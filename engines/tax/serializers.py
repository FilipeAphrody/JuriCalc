from rest_framework import serializers
from decimal import Decimal

class TaxCalculationSerializer(serializers.Serializer):
    principal = serializers.DecimalField(max_digits=15, decimal_places=2)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    fine_percentage = serializers.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0.00'))
