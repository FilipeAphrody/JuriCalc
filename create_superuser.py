import os
import django

# Força o uso do DB em Produção
os.environ['DATABASE_URL'] = 'postgresql://neondb_owner:npg_3pANijdnVk4r@ep-quiet-glitter-ac1q0j3j.sa-east-1.aws.neon.tech/neondb?sslmode=require'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

email = "admin@vademath.com"
password = "AdminMaster123!"

if not User.objects.filter(email=email).exists():
    # Na model customizada, usamos username=email
    user = User.objects.create_superuser(
        username=email,
        email=email,
        password=password
    )
    print(f"Superusuário '{email}' criado com sucesso no banco Neon!")
else:
    user = User.objects.get(email=email)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"Senha do Superusuário '{email}' redefinida/atualizada com sucesso no banco Neon!")
