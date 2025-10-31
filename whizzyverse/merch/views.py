from django.shortcuts import render
from rest_framework import viewsets
from .models import MerchItem
from .serializers import MerchItemSerializer


class MerchItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MerchItem.objects.all()
    serializer_class = MerchItemSerializer


def merch_store_view(request):
    merch_items = MerchItem.objects.filter(is_available=True)
    featured_items = merch_items.filter(featured=True)
    return render(request, 'merch/merch_store.html', {
        'merch_items': merch_items,
        'featured_items': featured_items,
    })
