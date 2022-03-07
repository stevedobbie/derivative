# Generated by Django 4.0.3 on 2022-03-05 14:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('drinks', '0005_alter_drink_image'),
        ('measures', '0003_remove_measure_offer_to_buy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measure',
            name='drink',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='measures', to='drinks.drink'),
        ),
        migrations.AlterField(
            model_name='measure',
            name='measure_unit_name',
            field=models.CharField(default=None, max_length=50),
        ),
        migrations.AlterField(
            model_name='measure',
            name='measure_volume',
            field=models.PositiveIntegerField(default=None),
        ),
        migrations.AlterField(
            model_name='measure',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='measures', to=settings.AUTH_USER_MODEL),
        ),
    ]