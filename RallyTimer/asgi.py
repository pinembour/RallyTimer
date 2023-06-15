"""
ASGI config for RallyTimer project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import timer.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'RallyTimer.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
      'websocket': URLRouter(
      timer.routing.websocket_urlpatterns
      ),
})
