"""
URL routing for ai_assistant application.
"""

from django.urls import path
from .views import ChatView, HealthView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='ai_chat'),
    path('health/', HealthView.as_view(), name='ai_health'),
]
