from django.urls import re_path
from .consumers import AdminChangeConsumer

websocket_urlpatterns = [
    re_path(r'ws/admin_changes/$', AdminChangeConsumer.as_asgi()),
]