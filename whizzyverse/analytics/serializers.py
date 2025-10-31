from rest_framework import serializers
from .models import Analytics


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analytics
        fields = ['id', 'track_plays', 'chat_sessions', 'total_fans', 
                  'page_views', 'merch_views', 'event_views', 'created_at']
        read_only_fields = ['created_at']
