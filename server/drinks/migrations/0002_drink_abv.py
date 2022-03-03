# Generated by Django 4.0.3 on 2022-03-03 10:16

from decimal import Decimal
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drinks', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='drink',
            name='abv',
            field=models.DecimalField(decimal_places=0, default=Decimal('0'), max_digits=3, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
    ]
