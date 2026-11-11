"""
URL configuration for kamverse_backend project.
"""

from django.urls import path, include

urlpatterns = [
    path('api/ai/', include('ai_assistant.urls')),
]
