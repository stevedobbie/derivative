# Generated by Django 4.0.3 on 2022-03-04 09:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('measures', '0002_alter_measure_drink_alter_measure_measure_unit_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='measure',
            name='offer_to_buy',
        ),
    ]
