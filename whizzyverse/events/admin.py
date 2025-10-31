from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'date', 'venue', 'city', 'is_past', 'created_at']
    list_filter = ['is_past', 'city', 'date']
    search_fields = ['name', 'venue', 'city']
    list_editable = ['is_past']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
