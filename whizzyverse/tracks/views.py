from django.shortcuts import render
from django.db.models import Q
from django.core.serializers import serialize
import json
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Track
from .serializers import TrackSerializer


class TrackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'genre', 'description']
    ordering_fields = ['title', 'release_date', 'plays', 'duration']
    ordering = ['-release_date']
    
    def get_queryset(self):
        queryset = Track.objects.all()
        genre = self.request.query_params.get('genre', None)
        featured = self.request.query_params.get('featured', None)
        
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def play(self, request, pk=None):
        track = self.get_object()
        track.increment_plays()
        return Response({'status': 'play counted', 'plays': track.plays})


def music_library_view(request):
    tracks = Track.objects.all()
    
    search_query = request.GET.get('search', '')
    genre_filter = request.GET.get('genre', '')
    sort_by = request.GET.get('sort', '-release_date')
    
    if search_query:
        tracks = tracks.filter(
            Q(title__icontains=search_query) |
            Q(genre__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    if genre_filter:
        tracks = tracks.filter(genre__icontains=genre_filter)
    
    allowed_sort_fields = ['title', '-title', 'release_date', '-release_date', 'plays', '-plays', 'duration', '-duration']
    if sort_by and sort_by in allowed_sort_fields:
        tracks = tracks.order_by(sort_by)
    else:
        tracks = tracks.order_by('-release_date')
    
    featured_tracks = Track.objects.filter(featured=True)[:3]
    all_genres = Track.objects.values_list('genre', flat=True).distinct()
    
    tracks_json = json.dumps([{
        'id': t.id,
        'title': t.title,
        'artist': t.artist,
        'genre': t.genre,
        'bpm': t.bpm,
        'artwork': t.artwork,
        'file_url': t.file_url if hasattr(t, 'file_url') else '',
        'duration': t.duration,
        'plays': float(t.plays)
    } for t in tracks])
    
    return render(request, 'tracks/music_library.html', {
        'tracks': tracks,
        'tracks_json': tracks_json,
        'featured_tracks': featured_tracks,
        'all_genres': all_genres,
        'search_query': search_query,
        'genre_filter': genre_filter,
        'sort_by': sort_by,
    })
