from django.contrib import admin
from .models import MerchItem


@admin.register(MerchItem)
class MerchItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'is_available', 'featured', 'created_at']
    list_filter = ['category', 'is_available', 'featured']
    search_fields = ['name', 'description']
    list_editable = ['is_available', 'featured', 'stock']
    readonly_fields = ['created_at', 'updated_at']
