from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from ...models import Semester
from . import _scraper as scraper
from datetime import date, datetime


class Command(BaseCommand):
    help = 'Populates the database with information from Testudo.'

    def handle(self, *args, **options):
        semester = Semester.objects.latest('start_date')
        start_date = getattr(semester, 'start_date')
        today = date.today()     # uses utc
        day = (today - start_date).days
