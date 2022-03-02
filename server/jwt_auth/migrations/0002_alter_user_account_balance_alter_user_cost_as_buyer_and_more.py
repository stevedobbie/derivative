# Generated by Django 4.0.3 on 2022-03-02 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jwt_auth', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='account_balance',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7),
        ),
        migrations.AlterField(
            model_name='user',
            name='cost_as_buyer',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7),
        ),
        migrations.AlterField(
            model_name='user',
            name='income_as_seller',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7),
        ),
        migrations.AlterField(
            model_name='user',
            name='loaded_credit',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.CharField(blank=True, max_length=300),
        ),
    ]
