import requests
import json
import os
import django
from urllib.parse import urlparse, parse_qs

# Configura o Django para acessar o BD localmente
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_3pANijdnVk4r@ep-quiet-glitter-ac1q0j3j.sa-east-1.aws.neon.tech/neondb?sslmode=require'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

User = get_user_model()

API_URL = "http://localhost:8000/api/v1"
TEST_EMAIL = "recoverytest@vademath.com"
TEST_PASSWORD = "Password123!"

print("--- INICIANDO TESTE E2E LOCAL DE RECUPERACAO DE SENHA ---")

# 1. Registrar o usuario
print(f"1. Registrando {TEST_EMAIL}...")
res = requests.post(f"{API_URL}/auth/register/", json={
    "name": "Test Recovery",
    "email": TEST_EMAIL,
    "company": "Test Recovery Office",
    "password": TEST_PASSWORD
})
if res.status_code in [201, 200, 400]: # 400 = ja existe
    print("Usuario registrado ou ja existente.")

# 2. Solicitar Reset
print("2. Solicitando recuperacao de senha...")
res = requests.post(f"{API_URL}/auth/password-reset/", json={
    "email": TEST_EMAIL
})
print("Reset response:", res.status_code, res.text)
assert res.status_code == 200, "Erro ao pedir reset"

# 3. Ler o token do BD diretamente (ja que a View apenas imprime no console)
user = User.objects.filter(email=TEST_EMAIL).first()
if not user:
    print("Falha: Usuario nao encontrado no BD local.")
    exit(1)

token = default_token_generator.make_token(user)
uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
print(f"3. Token mockado/interceptado: token={token} uid={uidb64}")

# 4. Confirmar Reset
NEW_PASSWORD = "NewPassword456!"
print("4. Confirmando nova senha...")
res = requests.post(f"{API_URL}/auth/password-reset/confirm/", json={
    "token": token,
    "uidb64": uidb64,
    "new_password": NEW_PASSWORD
})
print("Confirm response:", res.status_code, res.text)
assert res.status_code == 200, "Erro ao confirmar senha"

# 5. Tentar logar com nova senha
print("5. Logando com nova senha...")
res = requests.post(f"{API_URL}/auth/token/", json={
    "username": TEST_EMAIL,
    "password": NEW_PASSWORD
})
print("Login response:", res.status_code)
assert res.status_code == 200, "Erro ao logar com a nova senha!"

print("--- TESTE E2E DE RECUPERACAO CONCLUIDO COM SUCESSO! ---")
