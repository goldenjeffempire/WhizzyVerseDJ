from django.db import models


class Event(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateTimeField()
    venue = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='USA')
    banner = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    ticket_url = models.URLField(max_length=500, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    capacity = models.IntegerField(blank=True, null=True)
    is_past = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.name} - {self.venue}, {self.city}"
