from django.urls import path
from .views import DrinkDetailView, DrinkListView

# Request path: /drinks/

urlpatterns = [
    path('', DrinkListView.as_view()),
    path('<int:pk>/', DrinkDetailView.as_view())
]
