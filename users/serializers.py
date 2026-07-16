from rest_framework import serializers
from django.db import transaction
from users.models import CustomUser, Office, Plan, Role, Membership
import uuid

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, write_only=True)
    email = serializers.EmailField()
    company = serializers.CharField(max_length=255, write_only=True)
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        # 1. Obter ou criar um Plano base e Role base
        plan, _ = Plan.objects.get_or_create(name="Free MVP", defaults={"price": 0})
        role_owner, _ = Role.objects.get_or_create(name="Owner", defaults={"permissions": {"all": True}})
        
        # 2. Criar usuário
        user = CustomUser.objects.create(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['name'].split()[0],
            last_name=" ".join(validated_data['name'].split()[1:]) if " " in validated_data['name'] else ""
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # 3. Criar Office
        # Gere um CNPJ fake ou use uuid para o MVP caso CNPJ seja unique
        fake_cnpj = str(uuid.uuid4())[:14]
        office = Office.objects.create(
            name=validated_data['company'],
            cnpj=fake_cnpj,
            plan=plan
        )
        
        # 4. Criar Membership
        Membership.objects.create(
            user=user,
            office=office,
            role=role_owner
        )
        
        return user
