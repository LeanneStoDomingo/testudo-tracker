# Generated by Django 3.1.4 on 2021-01-18 21:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20210109_0049'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='professor',
            name='slug',
        ),
    ]
