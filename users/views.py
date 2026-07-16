from rest_framework import generics
from rest_framework.permissions import AllowAny
from users.serializers import RegisterSerializer
from django.contrib.auth import get_user_model

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
