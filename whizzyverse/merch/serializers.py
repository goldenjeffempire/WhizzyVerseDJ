from rest_framework import serializers
from .models import MerchItem


class MerchItemSerializer(serializers.ModelSerializer):
    in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = MerchItem
        fields = ['id', 'name', 'description', 'price', 'image_url', 'category', 
                  'stock', 'is_available', 'featured', 'in_stock', 'created_at']
        read_only_fields = ['created_at']
