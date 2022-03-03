from django.urls import path
from .views import MeasureDetailView, MeasureListView

urlpatterns = [
    path('', MeasureListView.as_view()),
    path('<int:pk>/', MeasureDetailView.as_view())
]