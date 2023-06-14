from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import Timer
# Create your views here.

class TimerListView(ListView):
    model = Timer
    template_name = 'timer/main.html'

class TimerDetailView(DetailView):
    model = Timer
    template_name = 'timer/detail.html'
