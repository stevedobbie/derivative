# Generated by Django 4.0.3 on 2022-03-07 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('measures', '0008_alter_measure_offer_to_sell'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measure',
            name='offer_to_sell',
            field=models.DecimalField(decimal_places=2, default=99.99, max_digits=4),
        ),
    ]
