from django.urls import path
from .views import LoginView, ProfileView, RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view())
]