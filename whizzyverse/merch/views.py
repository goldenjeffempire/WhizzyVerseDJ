from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets, filters
from .models import MerchItem
from .serializers import MerchItemSerializer


class MerchItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MerchItem.objects.all()
    serializer_class = MerchItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category', 'description']
    ordering_fields = ['name', 'price']
    ordering = ['name']
    
    def get_queryset(self):
        queryset = MerchItem.objects.filter(is_available=True)
        category = self.request.query_params.get('category', None)
        max_price = self.request.query_params.get('max_price', None)
        
        if category:
            queryset = queryset.filter(category__icontains=category)
        if max_price:
            try:
                queryset = queryset.filter(price__lte=float(max_price))
            except ValueError:
                pass
        
        return queryset


def merch_store_view(request):
    search_query = request.GET.get('search', '')
    category_filter = request.GET.get('category', '')
    sort_by = request.GET.get('sort', 'name')
    
    merch_items = MerchItem.objects.filter(is_available=True)
    
    if search_query:
        merch_items = merch_items.filter(
            Q(name__icontains=search_query) |
            Q(category__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    if category_filter:
        merch_items = merch_items.filter(category__icontains=category_filter)
    
    if sort_by:
        merch_items = merch_items.order_by(sort_by)
    
    featured_items = MerchItem.objects.filter(featured=True, is_available=True)[:3]
    all_categories = MerchItem.objects.filter(is_available=True).values_list('category', flat=True).distinct()
    
    return render(request, 'merch/merch_store.html', {
        'merch_items': merch_items,
        'featured_items': featured_items,
        'all_categories': all_categories,
        'search_query': search_query,
        'category_filter': category_filter,
        'sort_by': sort_by,
    })
