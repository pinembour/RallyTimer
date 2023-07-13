from django.urls import path
from .views import TimerListView, TimerDetailView

app_name = 'timer'

urlpatterns = [
    path('', TimerListView.as_view(), name='timer-list'),
    path('<slug:slug>/', TimerDetailView.as_view(), name='timer-detail'),
]