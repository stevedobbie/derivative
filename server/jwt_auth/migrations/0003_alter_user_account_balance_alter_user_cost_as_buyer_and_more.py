# Generated by Django 4.0.3 on 2022-03-02 17:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jwt_auth', '0002_alter_user_account_balance_alter_user_cost_as_buyer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='account_balance',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='cost_as_buyer',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='income_as_seller',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='loaded_credit',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]
