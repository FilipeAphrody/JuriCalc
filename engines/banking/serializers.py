from rest_framework import serializers

class BankingAmortizationSerializer(serializers.Serializer):
    principal = serializers.DecimalField(max_digits=15, decimal_places=2)
    rate = serializers.DecimalField(max_digits=5, decimal_places=4, help_text="Taxa ao mês em decimal (ex: 0.01)")
    periods = serializers.IntegerField(min_value=1)
    system = serializers.ChoiceField(choices=['PRICE', 'SAC', 'SACRE'], default='PRICE')
