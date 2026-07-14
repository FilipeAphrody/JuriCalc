from rest_framework import serializers

class PensionDelayedSerializer(serializers.Serializer):
    monthly_benefit = serializers.DecimalField(max_digits=15, decimal_places=2)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    index_name = serializers.CharField(max_length=50, default='INPC')
    interest_rate = serializers.DecimalField(max_digits=5, decimal_places=4, default='0.005')
