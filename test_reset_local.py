import requests

print("Testando request de recuperação...")
try:
    res = requests.post('http://localhost:8000/api/v1/auth/password-reset/', json={"email": "admin@vademath.com"})
    print("Status:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print("Erro:", e)
