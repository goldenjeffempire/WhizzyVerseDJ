from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'venue', 'city', 'country', 'banner', 
                  'description', 'ticket_url', 'ticket_price', 'capacity', 
                  'is_past', 'created_at']
        read_only_fields = ['created_at']
