from rest_framework import serializers
from .models import Lawsuit
from clients.models import Client

class LawsuitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lawsuit
        exclude = ['deleted_at']
        read_only_fields = ['office', 'created_at', 'updated_at']

    def validate_client(self, value):
        # Garante que o cliente pertence ao mesmo escritório da request
        request = self.context.get('request')
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        if str(value.office.id) != str(office_id):
            raise serializers.ValidationError("Este cliente não pertence ao seu escritório.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        validated_data['office_id'] = office_id
        return super().create(validated_data)
