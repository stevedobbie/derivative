# Generated by Django 4.0.3 on 2022-03-02 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jwt_auth', '0003_alter_user_account_balance_alter_user_cost_as_buyer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]