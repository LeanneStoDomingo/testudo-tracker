# Generated by Django 3.1.4 on 2021-01-04 22:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20201225_2219'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='description',
        ),
    ]