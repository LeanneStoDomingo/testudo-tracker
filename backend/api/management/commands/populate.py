from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from ...models import Department, Semester
from . import _scraper as scraper


class Command(BaseCommand):
    help = 'Populates the database with information from Testudo.'

    def add_arguments(self, parser):
        parser.add_argument('type',
                            type=str,
                            choices=['dept/geneds', 'courses'],
                            help='Scrapes Testudo to populate the database')
        parser.add_argument('--semester', nargs=2, help='first argument: year | second argument: month (01 or 08)')

    def handle(self, *args, **options):
        if (options['semester'] != None):
            s = Semester(year=options['semester'][0], month=options['semester'][1])
            s.save()

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
            self.stdout.write(self.style.ERROR('Make sure you have selected the options correctly'))
