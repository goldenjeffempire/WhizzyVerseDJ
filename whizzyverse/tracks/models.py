from django.db import models


class Track(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, default='DJ Whizzy')
    genre = models.CharField(max_length=100)
    bpm = models.IntegerField()
    duration = models.CharField(max_length=20, default='3:30')
    artwork = models.URLField(max_length=500, blank=True, null=True)
    file_url = models.URLField(max_length=500, blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    plays = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.artist}"

    def increment_plays(self):
        self.plays += 1
        self.save()
