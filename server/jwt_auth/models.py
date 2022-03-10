from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.CharField(max_length=50, unique=True)
    profile_image = models.CharField(max_length=300, blank=True, null=True)
    loaded_credit  = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    cost_as_buyer = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    income_as_seller = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    account_balance = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)