from django.urls import path
from .views import BidDetailView, BidListView

urlpatterns = [
    path('', BidListView.as_view()),
    path('<int:pk>/', BidDetailView.as_view())
]