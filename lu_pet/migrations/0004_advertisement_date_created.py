# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-04-14 21:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lu_pet', '0003_feedback'),
    ]

    operations = [
        migrations.AddField(
            model_name='advertisement',
            name='date_created',
            field=models.DateField(auto_now=True),
        ),
    ]
