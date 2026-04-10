from django.urls import path
from .views import ImageTaskListView, ImageTaskDetailView

urlpatterns = [
    path('', ImageTaskListView.as_view(), name='image-history'),
    path('<uuid:pk>/', ImageTaskDetailView.as_view(), name='image-detail'),
]
