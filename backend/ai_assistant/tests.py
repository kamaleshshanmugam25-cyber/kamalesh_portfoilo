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

    # 1. Open JobSphere.
    def test_command_1_open_jobsphere(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open JobSphere.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'OPEN_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'jobsphere')
        self.assertIn("JobSphere", response.data.get('message'))

    # 2. Open jobspeher. (typo tolerance)
    def test_command_2_open_jobspeher_typo(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open jobspeher.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'OPEN_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'jobsphere')
        self.assertIn("JobSphere", response.data.get('message'))

    # 3. Open RSK Traders.
    def test_command_3_open_rsk_traders(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open RSK Traders.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'OPEN_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'rsk-traders')
        self.assertIn("RSK Traders", response.data.get('message'))

    # 4. Close RSK Traders.
    def test_command_4_close_rsk_traders(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Close RSK Traders.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'CLOSE_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'rsk-traders')
        self.assertIn("closed successfully", response.data.get('message'))

    # 5. RSK Traders tab.
    def test_command_5_rsk_traders_tab(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'RSK Traders tab.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'SWITCH_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'rsk-traders')
        self.assertIn("Switching to your RSK Traders window", response.data.get('message'))

    # 6. Switch to Photography.
    def test_command_6_switch_to_photography(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Switch to Photography.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'SWITCH_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'photography')
        self.assertIn("Switching to your Photography window", response.data.get('message'))

    # 7. Minimize JobSphere.
    def test_command_7_minimize_jobsphere(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Minimize JobSphere.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'MINIMIZE_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'jobsphere')
        self.assertIn("Minimized JobSphere window", response.data.get('message'))

    # 8. Restore JobSphere.
    def test_command_8_restore_jobsphere(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Restore JobSphere.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'RESTORE_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'jobsphere')
        self.assertIn("Restored JobSphere window", response.data.get('message'))

    # 9. Maximize RSK Traders.
    def test_command_9_maximize_rsk_traders(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Maximize RSK Traders.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'MAXIMIZE_APPLICATION')
        self.assertEqual(actions[0].get('value'), 'rsk-traders')
        self.assertIn("Maximized RSK Traders window", response.data.get('message'))

    # 10. Close all windows.
    def test_command_10_close_all_windows(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Close all windows.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'CLOSE_ALL_WINDOWS')

    # 11. Open RSK Traders and JobSphere side-by-side.
    def test_command_11_open_side_by_side(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Open RSK Traders and JobSphere side-by-side.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 3)
        types = [a.get('type') for a in actions]
        self.assertIn('OPEN_APPLICATION', types)
        self.assertIn('ARRANGE_WINDOWS', types)
        self.assertIn("side-by-side", response.data.get('message'))

    # 12. Hi chat.
    def test_command_12_hi_chat(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Hi chat.',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("Hey!", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # 13. What is your name?
    def test_command_13_name(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'What is your name?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("KAM AI", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # 14. What can you do?
    def test_command_14_capability(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'What can you do?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("open applications", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # 15. Are you there?
    def test_command_15_are_you_there(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Are you there?',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        msg = response.data.get('message') or response.data.get('response')
        self.assertIn("Always ready!", msg)
        self.assertEqual(len(response.data.get('actions', [])), 0)

    # 16. Show JobSphere (3D Planet Navigation)
    def test_command_16_show_jobsphere(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Show JobSphere',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'FOCUS_PLANET')
        self.assertEqual(actions[0].get('value'), 'jobsphere')

    # 17. Show my Python projects
    def test_command_17_python_projects(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Show my Python projects',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'HIGHLIGHT_TECH_PLANETS')
        self.assertEqual(actions[0].get('value'), 'Python')

    # 18. Reset the universe
    def test_command_18_reset_universe(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Reset the universe',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'RESET_UNIVERSE')

    # 19. Go back to desktop
    def test_command_19_back_to_desktop(self):
        response = self.client.post('/api/ai/chat/', {
            'message': 'Go back to desktop',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        actions = response.data.get('actions', [])
        self.assertGreaterEqual(len(actions), 1)
        self.assertEqual(actions[0].get('type'), 'NAVIGATE')
        self.assertEqual(actions[0].get('value'), 'desktop')

    # Validation test
    def test_chat_empty_validation(self):
        response = self.client.post('/api/ai/chat/', {
            'message': '   ',
            'conversation_id': 'test-session'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
