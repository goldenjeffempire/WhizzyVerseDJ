from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Analytics
from .serializers import AnalyticsSerializer
from whizzyverse.tracks.models import Track


class AnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer


@api_view(['GET'])
def analytics_summary(request):
    try:
        analytics = Analytics.objects.latest('created_at')
    except Analytics.DoesNotExist:
        analytics = Analytics.objects.create()
    
    total_tracks = Track.objects.count()
    featured_tracks = Track.objects.filter(featured=True).count()
    
    return Response({
        'track_plays': analytics.track_plays,
        'chat_sessions': analytics.chat_sessions,
        'total_fans': analytics.total_fans,
        'page_views': analytics.page_views,
        'total_tracks': total_tracks,
        'featured_tracks': featured_tracks,
    })


def admin_dashboard_view(request):
    try:
        analytics = Analytics.objects.latest('created_at')
    except Analytics.DoesNotExist:
        analytics = Analytics.objects.create()
    
    total_tracks = Track.objects.count()
    featured_tracks = Track.objects.filter(featured=True).count()
    
    avg_plays_per_track = (analytics.track_plays / total_tracks) if total_tracks > 0 else 0
    
    return render(request, 'analytics/admin_dashboard.html', {
        'analytics': analytics,
        'total_tracks': total_tracks,
        'featured_tracks': featured_tracks,
        'avg_plays_per_track': avg_plays_per_track,
    })
