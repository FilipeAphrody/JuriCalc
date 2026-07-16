from rest_framework import serializers
from decimal import Decimal

class AlimonyArrearsSerializer(serializers.Serializer):
    monthly_alimony = serializers.DecimalField(max_digits=15, decimal_places=2)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    index_name = serializers.CharField(max_length=50, default='INPC')
    interest_rate = serializers.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0.01'))
    fine_percentage = serializers.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0.10'))
