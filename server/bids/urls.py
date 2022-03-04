from django.urls import path
from .views import BidListView

urlpatterns = [
    path('', BidListView.as_view())
]