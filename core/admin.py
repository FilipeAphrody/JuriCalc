from django.contrib import admin
from .models import EconomicIndex, Calculation, CalculationVersion, AuditLog

@admin.register(EconomicIndex)
class EconomicIndexAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'value')
    list_filter = ('name',)
    search_fields = ('name',)

@admin.register(Calculation)
class CalculationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'engine', 'office', 'created_at')
    list_filter = ('engine', 'office')
    search_fields = ('title',)

@admin.register(CalculationVersion)
class CalculationVersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'calculation', 'version_number', 'created_at')
    list_filter = ('calculation__engine',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'calculation_version', 'timestamp')
    list_filter = ('action', 'timestamp')

