from django.contrib import admin
from .models import EconomicIndex, CalculationVersion, AuditLog

@admin.register(EconomicIndex)
class EconomicIndexAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'value')
    list_filter = ('name',)
    search_fields = ('name',)

@admin.register(CalculationVersion)
class CalculationVersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'domain', 'version_number', 'created_at')
    list_filter = ('domain',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'calculation_version', 'timestamp')
    list_filter = ('action', 'timestamp')

