from rest_framework import serializers
from .models import ImageTask

class ImageTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageTask
        fields = ['id', 'user', 'original_image', 'processed_image', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'processed_image', 'status', 'created_at', 'updated_at']

    def validate_original_image(self, value):
        # Validate file size (MAX 5MB)
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("File size must be under 5MB.")

        # Validate file format
        valid_extensions = ['jpg', 'jpeg', 'png']
        ext = value.name.split('.')[-1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError("Unsupported file format. Allowed formats: JPG, JPEG, PNG.")
            
        return value
