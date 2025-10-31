from django.db import models
from django.utils import timezone


class Analytics(models.Model):
    date = models.DateField(unique=True)
    track_plays = models.IntegerField(default=0)
    chat_sessions = models.IntegerField(default=0)
    total_fans = models.IntegerField(default=0)
    page_views = models.IntegerField(default=0)
    merch_views = models.IntegerField(default=0)
    event_views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Analytics'
        ordering = ['-date']

    def __str__(self):
        return f"Analytics - {self.date}"

    @classmethod
    def get_or_create_today(cls):
        today = timezone.now().date()
        analytics, created = cls.objects.get_or_create(
            date=today,
            defaults={
                'track_plays': 0,
                'chat_sessions': 0,
                'total_fans': 0,
                'page_views': 0,
                'merch_views': 0,
                'event_views': 0,
            }
        )
        return analytics

    def increment_track_plays(self):
        self.track_plays += 1
        self.save()

    def increment_chat_sessions(self):
        self.chat_sessions += 1
        self.save()

    def increment_page_views(self):
        self.page_views += 1
        self.save()
