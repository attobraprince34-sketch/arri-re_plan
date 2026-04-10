import uuid
import os
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return f'user_{instance.user.id}/{filename}'

# Define choices before using them
PENDING = 'PENDING'
PROCESSING = 'PROCESSING'
COMPLETED = 'COMPLETED'
FAILED = 'FAILED'

STATUS_CHOICES = [
    (PENDING, 'Pending'),
    (PROCESSING, 'Processing'),
    (COMPLETED, 'Completed'),
    (FAILED, 'Failed'),
]

class ImageTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='image_tasks')
    original_image = models.ImageField(upload_to=user_directory_path)
    processed_image = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.id} - {self.status}"
