from django.shortcuts import render
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


def events_view(request):
    upcoming_events = Event.objects.filter(is_past=False).order_by('date')
    past_events = Event.objects.filter(is_past=True).order_by('-date')
    return render(request, 'events/events.html', {
        'upcoming_events': upcoming_events,
        'past_events': past_events,
    })
