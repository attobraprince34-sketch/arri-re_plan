from django.contrib import admin
from .models import ImageTask

@admin.register(ImageTask)
class ImageTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'id')
