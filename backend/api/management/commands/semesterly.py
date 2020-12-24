from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from ...models import Department, Semester
from . import _scraper as scraper


class Command(BaseCommand):
    help = 'A semesterly run command that populates the Semester table and scrapes from Testudo to populate the Department table'

    def add_arguments(self, parser):
        parser.add_argument('semester', nargs=2, help='first argument: season (fall or spring) | second argument: year')
        parser.add_argument('start_date', type=str, help='first day that scraper starts (yyyy-mm-dd)')

    def handle(self, *args, **options):

        # adds departments to Department table
        departments = scraper.get_departments()
        for department in departments:
            try:
                d = Department(code=department['code'], name=department['name'])
                d.save()
            except IntegrityError as e:
                self.stdout.write(self.style.ERROR(f'IntegrityError: {str(e)}'))

        # adds new semester to Semester table
        if (options['semester'][0].lower() == 'fall'):
            semester = '08'
        elif (options['semester'][0].lower() == 'spring'):
            semester = '01'
        else:
            self.stdout.write(self.style.ERROR('The first argument for the semester argument has to be either fall or spring'))
            return

        try:
            s = Semester(year=options['semester'][1], month=semester, start_date=options['start_date'])
            s.save()
        except:
            self.stdout.write(self.style.ERROR('Something went wrong! Check the format for the start_date argument (yyyy-mm-dd)'))
