import os
import django
import requests

os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_3pANijdnVk4r@ep-quiet-glitter-ac1q0j3j.sa-east-1.aws.neon.tech/neondb?sslmode=require'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

User = get_user_model()
email = "admin@vademath.com"
user = User.objects.filter(email=email).first()
if not user:
    print("Usuario nao encontrado no DB Neon!")
    exit(1)

# Simula o envio do e-mail pegando o token direto
token = default_token_generator.make_token(user)
uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

print(f"Token gerado: {token}")
print(f"UID: {uidb64}")

# Testa bater na API de Confirmar Reset que esta rodando localmente (mas apontando pro Neon localmente se rodarmos runserver com DATABASE_URL)
# Na verdade vamos testar a logica interna
print("Tudo pronto para teste local.")
