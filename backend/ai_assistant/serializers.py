"""
KAM AI - Request Serializers and Input Validation
"""

import re
from rest_framework import serializers

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=True,
        max_length=2000,
        trim_whitespace=True,
        error_messages={
            'required': 'Message cannot be empty.',
            'max_length': 'Message is too long (maximum 2000 characters).'
        }
    )
    conversation_id = serializers.CharField(
        required=False,
        max_length=120,
        default='default_session'
    )
    available_repos = serializers.ListField(
        required=False,
        child=serializers.DictField(),
        default=list
    )

    def validate_message(self, value):
        # Strip null bytes and non-printable control characters
        cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', value)
        if not cleaned.strip():
            raise serializers.ValidationError("Message cannot be whitespace only.")
        return cleaned.strip()
