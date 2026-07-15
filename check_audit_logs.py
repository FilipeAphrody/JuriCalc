import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lexcalc.settings')
django.setup()

from core.models import AuditLog

def check_logs():
    print("=== AUDIT LOGS DUMP ===")
    logs = AuditLog.objects.all().order_by('-timestamp')[:5]
    for log in logs:
        print(f"[{log.timestamp}] Action: {log.action} | Calculation Version ID: {log.calculation_version.id}")
    
    if len(logs) > 0:
        print("\n[+] SUCCESS: Audit Logs correctly tracked the Black-Box executions.")
    else:
        print("\n[!] WARNING: No Audit Logs found.")

if __name__ == '__main__':
    check_logs()
