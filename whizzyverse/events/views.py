from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets, filters
from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'venue', 'city', 'description']
    ordering_fields = ['title', 'date']
    ordering = ['date']
    
    def get_queryset(self):
        queryset = Event.objects.all()
        city = self.request.query_params.get('city', None)
        upcoming = self.request.query_params.get('upcoming', None)
        
        if city:
            queryset = queryset.filter(city__icontains=city)
        if upcoming == 'true':
            queryset = queryset.filter(is_past=False)
        
        return queryset


def events_view(request):
    search_query = request.GET.get('search', '')
    city_filter = request.GET.get('city', '')
    view_filter = request.GET.get('view', 'upcoming')
    
    upcoming_events = Event.objects.filter(is_past=False).order_by('date')
    past_events = Event.objects.filter(is_past=True).order_by('-date')
    
    if search_query:
        upcoming_events = upcoming_events.filter(
            Q(title__icontains=search_query) |
            Q(venue__icontains=search_query) |
            Q(city__icontains=search_query) |
            Q(description__icontains=search_query)
        )
        past_events = past_events.filter(
            Q(title__icontains=search_query) |
            Q(venue__icontains=search_query) |
            Q(city__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    if city_filter:
        upcoming_events = upcoming_events.filter(city__icontains=city_filter)
        past_events = past_events.filter(city__icontains=city_filter)
    
    all_cities = Event.objects.values_list('city', flat=True).distinct()
    
    return render(request, 'events/events.html', {
        'upcoming_events': upcoming_events,
        'past_events': past_events,
        'all_cities': all_cities,
        'search_query': search_query,
        'city_filter': city_filter,
        'view_filter': view_filter,
    })
