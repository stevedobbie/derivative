# Generated by Django 4.0.3 on 2022-03-03 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('drinks', '0003_alter_drink_abv'),
    ]

    operations = [
        migrations.AlterField(
            model_name='drink',
            name='image',
            field=models.CharField(default=None, max_length=299),
        ),
    ]
