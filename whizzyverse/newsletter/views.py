from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import NewsletterSubscriber
from .serializers import NewsletterSubscriberSerializer

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    
    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if NewsletterSubscriber.objects.filter(email=email).exists():
            return Response(
                {'message': 'You are already subscribed to our newsletter!'},
                status=status.HTTP_200_OK
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {'message': 'Successfully subscribed to WhizzyVerse newsletter!'},
            status=status.HTTP_201_CREATED
        )
