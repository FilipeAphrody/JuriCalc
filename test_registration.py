import os
import django
from django.test import Client
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

client = Client()
response = client.post('/api/v1/auth/register/', {
    'name': 'Filipe Tester',
    'email': 'filipe.tester2@vademath.com',
    'company': 'VadeMath QA',
    'password': 'securepassword123'
}, content_type='application/json')

print("Status:", response.status_code)
print("Content:", response.content.decode())

# Try to get token
response2 = client.post('/api/v1/auth/token/', {
    'username': 'filipe.tester2@vademath.com',
    'password': 'securepassword123'
}, content_type='application/json')
print("Token Status:", response2.status_code)
print("Token Content:", response2.content.decode())
