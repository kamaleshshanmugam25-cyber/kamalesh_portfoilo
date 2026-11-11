"""
KAM AI - API Views & Rate Limiting
"""

import time
from collections import defaultdict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChatRequestSerializer
from .services import process_chat_message

# In-memory IP rate limiter: max 40 requests per minute per IP
RATE_LIMIT_BUCKET = defaultdict(list)
RATE_LIMIT_MAX_REQUESTS = 40
RATE_LIMIT_WINDOW_SECONDS = 60

def is_rate_limited(ip_address: str) -> bool:
    """Check if the client IP has exceeded the request allowance."""
    now = time.time()
    timestamps = RATE_LIMIT_BUCKET[ip_address]
    # Prune timestamps older than window
    valid_timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    RATE_LIMIT_BUCKET[ip_address] = valid_timestamps

    if len(valid_timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        return True

    RATE_LIMIT_BUCKET[ip_address].append(now)
    return False

def get_client_ip(request):
    """Retrieve client IP address considering proxy headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '127.0.0.1')

class ChatView(APIView):
    """
    POST /api/ai/chat/
    Processes chat prompts for KAM AI with safe navigation action payloads.
    """
    def post(self, request, *args, **kwargs):
        client_ip = get_client_ip(request)

        # Rate limit enforcement
        if is_rate_limited(client_ip):
            return Response(
                {
                    "error": "Too Many Requests",
                    "response": "You are sending messages too quickly. Please wait a moment before asking again.",
                    "action": None
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "error": "Validation Error",
                    "details": serializer.errors,
                    "response": "Please check your message and try again."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data
        message = data['message']
        conversation_id = data.get('conversation_id', 'default_session')
        available_repos = data.get('available_repos', [])

        try:
            result = process_chat_message(
                message=message,
                conversation_id=conversation_id,
                available_repos=available_repos
            )
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {
                    "response": "I encountered an error processing your query. Please ask again.",
                    "action": None,
                    "suggestions": ["Who is Kamalesh?", "Show all projects", "Open RSK Traders"]
                },
                status=status.HTTP_200_OK
            )

class HealthView(APIView):
    """
    GET /api/ai/health/
    Health and readiness probe.
    """
    def get(self, request, *args, **kwargs):
        return Response({
            "status": "healthy",
            "service": "KAM AI Assistant API",
            "version": "2.6.0",
            "architecture": "Neo-Brutalist Digital Ecosystem"
        }, status=status.HTTP_200_OK)
