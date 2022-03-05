from tkinter import CASCADE
from django.db import models

# Create your models here.
class Measure(models.Model):
    measure_volume = models.PositiveIntegerField(default=None)
    measure_unit_name = models.CharField(max_length=50, default=None)
    offer_to_sell = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    drunk = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    drink = models.ForeignKey(
        "drinks.Drink",
        related_name = "measures",
        on_delete = models.CASCADE # if the drink is deleted then the measure should also be deleted
    )
    owner = models.ForeignKey(
        "jwt_auth.User",
        related_name = "measures",
        on_delete = models.CASCADE # if user is deleted their owned measures are also deleted. Can later add validation to prevent user deletion unless they have traded/drunk all their measures
    )

    # reformat string on admin site
    def __str__(self):
        return f"{self.drink} - {self.measure_unit_name} ({self.owner})"