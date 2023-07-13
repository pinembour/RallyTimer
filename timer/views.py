from django.views.generic import ListView, DetailView
from .models import Timer
from django.utils import timezone
# Create your views here.

class TimerListView(ListView):
    model = Timer
    template_name = 'timer/main.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        server_timezone = timezone.get_current_timezone()
        context['server_timezone'] = server_timezone
        for obj in Timer.objects.all():
            context['paused' + str(obj.name)] = obj.paused
        context['timers'] = Timer.objects.all()
        return context

class TimerDetailView(DetailView):
    model = Timer
    template_name = 'timer/detail.html'
    slug_url_kwarg = 'slug'
    slug_field = 'name'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        server_timezone = timezone.get_current_timezone()
        context['server_timezone'] = server_timezone
        for obj in Timer.objects.all():
            context['paused' + str(obj.name)] = obj.paused
        context['timers'] = Timer.objects.all()
        return context