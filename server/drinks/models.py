from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Validate abv field
PERCENTAGE_VALIDATOR = [MinValueValidator(0.0), MaxValueValidator(99.9)]

# Create your models here.
class Drink(models.Model):
    name = models.CharField(max_length=50, default=None, unique=True)
    total_volume = models.PositiveIntegerField(default=None)
    abv = models.DecimalField(max_digits=3, decimal_places=1, default=Decimal(0.0), validators=PERCENTAGE_VALIDATOR)
    total_measures = models.PositiveIntegerField(default=None)
    measures_remaining = models.PositiveIntegerField(default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(default=None)
    image = models.CharField(max_length=300, default=None)

    # reformat record string on django admin
    def __str__(self):
        return f"{self.name}"