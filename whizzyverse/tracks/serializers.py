from rest_framework import serializers
from .models import Track


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ['id', 'title', 'artist', 'genre', 'bpm', 'duration', 'artwork', 
                  'file_url', 'release_date', 'plays', 'featured', 'created_at']
        read_only_fields = ['plays', 'created_at']
