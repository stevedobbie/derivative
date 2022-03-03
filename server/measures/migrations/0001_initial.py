# Generated by Django 4.0.3 on 2022-03-03 15:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('drinks', '0005_alter_drink_image'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Measure',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('measure_volume', models.PositiveIntegerField(default=None)),
                ('measure_unit_name', models.CharField(default=None, max_length=50)),
                ('offer_to_buy', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('offer_to_sell', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('drunk', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('drink', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='measures', to='drinks.drink')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='measures', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]