from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import ImageTask
from .serializers import ImageTaskSerializer

class ImageTaskListView(generics.ListCreateAPIView):
    serializer_class = ImageTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ImageTask.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Save the initial image task with PENDING status
        task = serializer.save(user=self.request.user)
        
        # Dispatch Celery task for background processing
        from .tasks import process_image_task
        process_image_task.delay(str(task.id))

class ImageTaskDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ImageTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ImageTask.objects.filter(user=self.request.user)
