from django.shortcuts import render
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json
import os
from openai import OpenAI


def load_whizzy_persona():
    persona_path = os.path.join(settings.BASE_DIR, 'seed', 'whizzy_persona.json')
    try:
        with open(persona_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None


@api_view(['POST'])
def chat_with_whizbot(request):
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response(
            {'error': 'Message is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    persona = load_whizzy_persona()
    if not persona:
        return Response(
            {'error': 'WhizBot persona not loaded'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        return Response({
            'response': "Yo! WhizBot here! I'm currently in offline mode, but I'm still hyped to be part of the WhizzyVerse! To unlock my full AI capabilities and have real conversations, you'll need to add an OPENAI_API_KEY to your environment. Until then, I'm here in spirit, ready to represent DJ Whizzy and the Sound Dimension! Stay tuned, fam! 🎧✨"
        })
    
    try:
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": persona.get('system_prompt', '')},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.8,
        )
        
        whizbot_response = response.choices[0].message.content
        
        from whizzyverse.analytics.models import Analytics
        analytics = Analytics.get_or_create_today()
        analytics.increment_chat_sessions()
        
        return Response({
            'response': whizbot_response
        })
        
    except Exception as e:
        return Response({
            'response': f"Yo! WhizBot here! I'm experiencing some technical difficulties right now, but the vibe is still strong! The WhizzyVerse is always here for you. Try again in a moment, fam! 🎵"
        })
