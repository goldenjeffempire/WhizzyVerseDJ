from django.contrib import admin
from .models import Track


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ['title', 'artist', 'genre', 'bpm', 'plays', 'featured', 'created_at']
    list_filter = ['genre', 'featured', 'created_at']
    search_fields = ['title', 'artist', 'genre']
    list_editable = ['featured']
    readonly_fields = ['plays', 'created_at', 'updated_at']
