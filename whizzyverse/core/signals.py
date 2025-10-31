from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender='tracks.Track')
def track_engagement_on_play(sender, instance, created, **kwargs):
    """Track play count changes in analytics"""
    if not created:
        from whizzyverse.analytics.models import Analytics
        analytics, _ = Analytics.objects.get_or_create(id=1)
        analytics.total_track_plays = sender.objects.aggregate(
            total=models.Sum('plays')
        )['total'] or 0
        analytics.save()


@receiver(post_save, sender='ai_connector.ChatLog')
def track_chat_sessions(sender, instance, created, **kwargs):
    """Track chat sessions in analytics"""
    if created:
        from whizzyverse.analytics.models import Analytics
        analytics, _ = Analytics.objects.get_or_create(id=1)
        analytics.total_chat_sessions = sender.objects.count()
        analytics.save()


@receiver(post_save, sender='newsletter.NewsletterSubscriber')
def track_newsletter_signups(sender, instance, created, **kwargs):
    """Track newsletter signups"""
    if created:
        from whizzyverse.analytics.models import Analytics
        analytics, _ = Analytics.objects.get_or_create(id=1)
        analytics.total_newsletter_subscribers = sender.objects.filter(is_active=True).count()
        analytics.save()


@receiver(post_save, sender='contact.ContactMessage')
def track_contact_messages(sender, instance, created, **kwargs):
    """Track contact form submissions"""
    if created:
        from whizzyverse.analytics.models import Analytics
        analytics, _ = Analytics.objects.get_or_create(id=1)
        analytics.total_contact_messages = sender.objects.count()
        analytics.save()
