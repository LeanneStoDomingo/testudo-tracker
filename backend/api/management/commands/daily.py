from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from ...models import Course, Department, Semester
from . import _scraper as scraper
from datetime import date


class Command(BaseCommand):
    help = 'Populates the database with information from Testudo.'

    def handle(self, *args, **options):
        semester = Semester.objects.latest('start_date')
        end_date = getattr(semester, 'end_date')

        if ((end_date - date.today()).days < 0):
            return

        start_date = getattr(semester, 'start_date')
        day = (date.today() - start_date).days

        departments = Department.objects.all()
        for department in departments:
            courses = scraper.get_courses(semester, department)
            for course in courses:
                Course.objects.update_or_create(
                    code=course['code'],
                    name=course['name'],
                    description=course['description'],
                    department=department,
                    gened=course['gened'],
                )
