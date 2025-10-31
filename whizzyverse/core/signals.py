from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='tracks.Track')
def track_engagement_on_play(sender, instance, created, **kwargs):
    """Track play count changes in analytics"""
    if not created:
        from whizzyverse.analytics.models import Analytics
        analytics = Analytics.get_or_create_today()
        total_plays = sender.objects.aggregate(total=models.Sum('plays'))['total'] or 0
        analytics.track_plays = total_plays
        analytics.save()


@receiver(post_save, sender='newsletter.NewsletterSubscriber')
def track_newsletter_signups(sender, instance, created, **kwargs):
    """Track newsletter signups"""
    if created:
        from whizzyverse.analytics.models import Analytics
        analytics = Analytics.get_or_create_today()
        analytics.total_fans = sender.objects.filter(is_active=True).count()
        analytics.save()
