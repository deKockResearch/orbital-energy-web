from django.urls import path
from . import views

urlpatterns = [
    path('tab/<str:tab_name>/', views.tab_content, name='tab_content'),
]