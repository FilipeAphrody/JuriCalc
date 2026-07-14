from rest_framework import serializers

class CivilCalculationSerializer(serializers.Serializer):
    principal = serializers.DecimalField(max_digits=15, decimal_places=2)
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    index_name = serializers.CharField(max_length=50)
    interest_rate = serializers.DecimalField(max_digits=5, decimal_places=4)
    interest_type = serializers.ChoiceField(choices=['simple', 'compound'], default='simple')
    fine_percentage = serializers.DecimalField(max_digits=5, decimal_places=4, default='0.00')
    fees_percentage = serializers.DecimalField(max_digits=5, decimal_places=4, default='0.00')
    claim_type = serializers.ChoiceField(choices=['debt', 'execution', 'rent', 'condo'], default='debt')
