from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from users.serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from users.serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer

class PasswordResetRequestView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            User = get_user_model()
            user = User.objects.filter(email=email).first()
            
            if user:
                # Gera o token
                token = default_token_generator.make_token(user)
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Mock: Imprime no console (Render Logs) ao invés de enviar por SMTP
                reset_link = f"https://vademath.vercel.app/reset-password?token={token}&uid={uidb64}"
                print("="*50)
                print("EMAIL DE RECUPERAÇÃO DE SENHA (MOCK)")
                print(f"Para: {email}")
                print(f"Link de Recuperação: {reset_link}")
                print("="*50)
            
            # Retorna 200 sempre, para evitar user enumeration (segurança)
            return Response(
                {"message": "Se o e-mail existir, um link de recuperação foi enviado."}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            uidb64 = serializer.validated_data['uidb64']
            new_password = serializer.validated_data['new_password']
            
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                User = get_user_model()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None
                
            if user and default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Senha redefinida com sucesso."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Token inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
