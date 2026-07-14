from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        # fields = '__all__' mas sem expor o deleted_at diretamente ou obrigar o envio do office_id (que virá do request)
        exclude = ['deleted_at']
        read_only_fields = ['office', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Injeta o office do request context (passado pela View)
        request = self.context.get('request')
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        validated_data['office_id'] = office_id
        return super().create(validated_data)
