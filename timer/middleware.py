from django.utils import timezone
from .models import ServerTimezone

class TimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            server_timezone = ServerTimezone.objects.first()
            if server_timezone:
                timezone.activate(server_timezone.timezone)
        except Exception as e:
            print(e)
            pass
        response = self.get_response(request)
        return response