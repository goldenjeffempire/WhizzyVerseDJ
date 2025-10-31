from django.db import models


class MerchItem(models.Model):
    CATEGORY_CHOICES = [
        ('apparel', 'Apparel'),
        ('accessories', 'Accessories'),
        ('music', 'Music'),
        ('collectibles', 'Collectibles'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='apparel')
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - ${self.price}"

    @property
    def in_stock(self):
        return self.stock > 0
