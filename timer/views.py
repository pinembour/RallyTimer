from typing import Any, Dict
from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import Timer
from django.utils import timezone
from django.shortcuts import render
# Create your views here.

class TimerListView(ListView):
    model = Timer
    template_name = 'timer/main.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        server_timezone = timezone.get_current_timezone()
        context['server_timezone'] = server_timezone
        return context

class TimerDetailView(DetailView):
    model = Timer
    template_name = 'timer/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        server_timezone = timezone.get_current_timezone()
        context['server_timezone'] = server_timezone
        return context