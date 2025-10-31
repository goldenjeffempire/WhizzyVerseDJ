from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Track
from .serializers import TrackSerializer


class TrackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    
    @action(detail=True, methods=['post'])
    def play(self, request, pk=None):
        track = self.get_object()
        track.increment_plays()
        return Response({'status': 'play counted', 'plays': track.plays})


def music_library_view(request):
    tracks = Track.objects.all()
    featured_tracks = Track.objects.filter(featured=True)
    return render(request, 'tracks/music_library.html', {
        'tracks': tracks,
        'featured_tracks': featured_tracks,
    })
