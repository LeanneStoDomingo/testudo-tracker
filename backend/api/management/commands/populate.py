from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from ...models import Department
from . import _scraper as scraper


class Command(BaseCommand):
    help = 'Populates the database with information from Testudo.'

    def handle(self, *args, **kwargs):
        departments = scraper.get_departments()

        for department in departments:
            try:
                d = Department(code=department['code'], name=department['name'])
                d.save()
            except IntegrityError as e:
                print(f'IntegrityError: {str(e)}')
