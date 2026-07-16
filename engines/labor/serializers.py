from rest_framework import serializers
from decimal import Decimal

class OvertimeCalculationSerializer(serializers.Serializer):
    base_salary = serializers.DecimalField(max_digits=15, decimal_places=2)
    overtime_hours = serializers.DecimalField(max_digits=10, decimal_places=2)
    overtime_percentage = serializers.DecimalField(max_digits=5, decimal_places=4, default=Decimal('0.50'))
    work_hours_monthly = serializers.DecimalField(max_digits=5, decimal_places=2, default=Decimal('220.00'))
    work_days_month = serializers.IntegerField(default=25)
    rest_days_month = serializers.IntegerField(default=5)
