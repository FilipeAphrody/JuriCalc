from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        exclude = ['deleted_at']
        read_only_fields = ['office', 'uploaded_by', 'created_at', 'updated_at']

    def validate(self, data):
        # Validações cruzadas de segurança no escritório
        request = self.context.get('request')
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        
        # Validar Client
        if 'client' in data and data['client'] and str(data['client'].office.id) != str(office_id):
            raise serializers.ValidationError({"client": "O cliente não pertence a este escritório."})
            
        # Validar Lawsuit
        if 'lawsuit' in data and data['lawsuit'] and str(data['lawsuit'].office.id) != str(office_id):
            raise serializers.ValidationError({"lawsuit": "O processo não pertence a este escritório."})
            
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        office_id = request.META.get('HTTP_X_OFFICE_ID')
        
        validated_data['office_id'] = office_id
        validated_data['uploaded_by'] = request.user
        
        # Se não vier nome do arquivo, pega do nome do upload
        if 'filename' not in validated_data and 'file' in validated_data:
            validated_data['filename'] = validated_data['file'].name
            
        return super().create(validated_data)
