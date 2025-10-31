from django.shortcuts import render
from whizzyverse.tracks.models import Track
from whizzyverse.events.models import Event
from whizzyverse.merch.models import MerchItem


def landing_page_view(request):
    featured_tracks = Track.objects.filter(featured=True)[:3]
    upcoming_events = Event.objects.filter(is_past=False).order_by('date')[:3]
    featured_merch = MerchItem.objects.filter(featured=True, is_available=True)[:3]
    
    return render(request, 'core/landing.html', {
        'featured_tracks': featured_tracks,
        'upcoming_events': upcoming_events,
        'featured_merch': featured_merch,
    })
