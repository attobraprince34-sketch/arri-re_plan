import os
from celery import shared_task
from django.core.files.base import ContentFile
from .models import ImageTask, PROCESSING, COMPLETED, FAILED

@shared_task
def process_image_task(task_id):
    try:
        # We import rembg here to avoid loading the heavy ONNX models into the main web process.
        # This keeps the main Django server lightweight.
        from rembg import remove
        
        task = ImageTask.objects.get(id=task_id)
        task.status = PROCESSING
        task.save(update_fields=['status'])
        
        # Read the original image contents
        input_data = task.original_image.read()
        
        # Process the image to remove background
        output_data = remove(input_data)
        
        # Create a new file name
        original_name = os.path.basename(task.original_image.name)
        name, ext = os.path.splitext(original_name)
        new_name = f"{name}_nobg.png"  # rembg typically outputs PNG (rgba)
        
        # Save the processed image
        task.processed_image.save(new_name, ContentFile(output_data), save=False)
        task.status = COMPLETED
        task.save(update_fields=['processed_image', 'status', 'updated_at'])
        
    except Exception as e:
        # In a production app, log the error with logging framework
        print(f"Error processing image {task_id}: {e}")
        try:
            task = ImageTask.objects.get(id=task_id)
            task.status = FAILED
            task.save(update_fields=['status', 'updated_at'])
        except ImageTask.DoesNotExist:
            pass
