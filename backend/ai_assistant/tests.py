from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class AIAssistantAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check(self):
        response = self.client.get('/api/ai/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'healthy')

    def test_chat_open_app(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open RSK Traders',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('action', response.data)
        action = response.data['action']
        self.assertIsNotNone(action)
        self.assertIn(action.get('type'), ['OPEN_APPLICATION', 'OPEN_APP'])
        self.assertEqual(action.get('payload', {}).get('applicationId'), 'rsk-traders')

    def test_chat_python_filter(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Show me Python projects',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        action = response.data.get('action')
        self.assertIsNotNone(action)
        self.assertEqual(action.get('type'), 'FILTER_PROJECTS')
        self.assertEqual(action.get('payload', {}).get('language'), 'Python')

    def test_chat_multi_step_arrange(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open RSK Traders and Photography side by side',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 2)
        # Check that arrange windows is included
        types = [a.get('type') for a in actions]
        self.assertIn('ARRANGE_WINDOWS', types)

    def test_chat_empty_validation(self):
        response = self.client.post('/api/ai/chat/', {
            'message': '   ',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
