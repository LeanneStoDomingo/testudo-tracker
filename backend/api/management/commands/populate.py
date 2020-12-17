from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from ...models import Department
from . import _scraper as scraper


class Command(BaseCommand):
    help = 'Populates the database with information from Testudo.'

    def add_arguments(self, parser):
        parser.add_argument('type', type=str, choices=['departments', 'courses'], help='Scrapes Testudo to populate the database')
        parser.add_argument('--semester', type=int, help='--courses uses this argument to scrape the correct semester')

    def handle(self, *args, **options):
        if (options['type'] == 'departments'):
            departments = scraper.get_departments()

            for department in departments:
                try:
                    d = Department(code=department['code'], name=department['name'])
                    d.save()
                except IntegrityError as e:
                    print(f'IntegrityError: {str(e)}')
        elif (options['type'] == 'courses'):
            pass
        else:
            self.stdout.write(self.style.ERROR('Either \'departments\' or \'courses\' has to be chosen'))
