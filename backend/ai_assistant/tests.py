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

    # Test 1: Hi
    def test_1_greeting(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Hi',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("Hey!", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # Test 2: What is your name?
    def test_2_name(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'What is your name?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("KAM AI", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # Test 3: Who created you?
    def test_3_creator(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Who created you?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("Kamalesh", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # Test 4: What can you do?
    def test_4_capability(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'What can you do?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("manage your workspace", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # Test 5: Tell me about yourself.
    def test_5_tell_me_about_yourself(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Tell me about yourself.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("KAM AI", msg)
        self.assertIn("personal assistant", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # Test 6: What is React?
    def test_6_what_is_react(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'What is React?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("JavaScript library", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # Test 7: Show my projects.
    def test_7_show_my_projects(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Show my projects.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'NAVIGATE')
        self.assertEqual(actions[0].get('value'), 'projects')

    # Test 8: Open RSK Traders.
    def test_8_open_rsk_traders(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open RSK Traders.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'OPEN_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'rsk-traders')

    # Test 9: Open RSK Traders and Photography side by side.
    def test_9_open_side_by_side(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open RSK Traders and Photography side by side.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 3)
        types = [a.get('type') for a in actions]
        self.assertIn('OPEN_APPLICATION', types)
        self.assertIn('ARRANGE_WINDOWS', types)

    # Test 10: Thank you.
    def test_10_thank_you(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Thank you.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("You're welcome", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    def test_chat_empty_validation(self):
        response = self.client.post('/api/ai/chat/', {
            'message': '   ',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
