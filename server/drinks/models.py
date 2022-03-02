from django.db import models

# Create your models here.
class Drink(models.Model):
    name = models.CharField(max_length=50, default=None, unique=True)
    total_volume = models.PositiveIntegerField(default=None)
    total_measures = models.PositiveIntegerField(default=None)
    measures_remaining = models.PositiveIntegerField(default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(default=None)
    image = models.CharField(max_length=300, default=None)

# reformat record string on django admin
def __str__(self):
    return f"{self.name} ({self.total_measures} measures)"