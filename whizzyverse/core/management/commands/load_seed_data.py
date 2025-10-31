import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from whizzyverse.tracks.models import Track
from whizzyverse.events.models import Event
from whizzyverse.merch.models import MerchItem
from whizzyverse.analytics.models import Analytics


class Command(BaseCommand):
    help = 'Load seed data from JSON files'

    def handle(self, *args, **options):
        seed_dir = os.path.join(settings.BASE_DIR, 'seed')
        
        self.stdout.write('Loading seed data...')
        
        self.load_tracks(os.path.join(seed_dir, 'whizzy_tracks.json'))
        self.load_events(os.path.join(seed_dir, 'whizzy_events.json'))
        self.load_merch(os.path.join(seed_dir, 'whizzy_merch.json'))
        self.create_initial_analytics()
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded all seed data!'))
    
    def load_tracks(self, file_path):
        with open(file_path, 'r') as f:
            tracks_data = json.load(f)
        
        Track.objects.all().delete()
        for track_data in tracks_data:
            Track.objects.create(**track_data)
        
        self.stdout.write(self.style.SUCCESS(f'Loaded {len(tracks_data)} tracks'))
    
    def load_events(self, file_path):
        with open(file_path, 'r') as f:
            events_data = json.load(f)
        
        Event.objects.all().delete()
        for event_data in events_data:
            Event.objects.create(**event_data)
        
        self.stdout.write(self.style.SUCCESS(f'Loaded {len(events_data)} events'))
    
    def load_merch(self, file_path):
        with open(file_path, 'r') as f:
            merch_data = json.load(f)
        
        MerchItem.objects.all().delete()
        for merch_item_data in merch_data:
            MerchItem.objects.create(**merch_item_data)
        
        self.stdout.write(self.style.SUCCESS(f'Loaded {len(merch_data)} merch items'))
    
    def create_initial_analytics(self):
        from django.utils import timezone
        Analytics.objects.all().delete()
        Analytics.objects.create(
            date=timezone.now().date(),
            track_plays=56650,
            chat_sessions=342,
            total_fans=12489,
            page_views=45230,
            merch_views=8920,
            event_views=6543
        )
        self.stdout.write(self.style.SUCCESS('Created initial analytics'))
