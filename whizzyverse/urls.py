from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

from whizzyverse.core.views import landing_page_view
from whizzyverse.tracks.views import TrackViewSet, music_library_view
from whizzyverse.events.views import EventViewSet, events_view
from whizzyverse.merch.views import MerchItemViewSet, merch_store_view
from whizzyverse.analytics.views import AnalyticsViewSet, analytics_summary, admin_dashboard_view
from whizzyverse.ai_connector.views import chat_with_whizbot
from whizzyverse.newsletter.views import NewsletterSubscriberViewSet
from whizzyverse.contact.views import ContactMessageViewSet

router = routers.DefaultRouter()
router.register(r'tracks', TrackViewSet)
router.register(r'events', EventViewSet)
router.register(r'merch', MerchItemViewSet)
router.register(r'analytics', AnalyticsViewSet)
router.register(r'newsletter', NewsletterSubscriberViewSet)
router.register(r'contact', ContactMessageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing_page_view, name='landing'),
    path('music/', music_library_view, name='music_library'),
    path('events/', events_view, name='events'),
    path('merch/', merch_store_view, name='merch_store'),
    path('admin-demo/', admin_dashboard_view, name='admin_dashboard'),
    path('api/', include(router.urls)),
    path('api/chat/', chat_with_whizbot, name='chat_whizbot'),
    path('api/analytics/summary/', analytics_summary, name='analytics_summary'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
