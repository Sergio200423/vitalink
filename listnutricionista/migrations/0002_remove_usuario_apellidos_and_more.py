# Generated by Django 5.1.3 on 2025-06-17 19:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('listnutricionista', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='apellidos',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='correo_electronico',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='nombre',
        ),
    ]
