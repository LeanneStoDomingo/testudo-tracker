from django.core.management.base import BaseCommand
# from django.db.utils import IntegrityError
from ...models import Course, Day, Department, GenEd, Professor, Section, Semester
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

                course_obj, _ = Course.objects.update_or_create(
                    code=course['code'],
                    name=course['name'],
                    description=course['description'],
                    department=department
                )

                geneds = course['geneds']
                for gened in geneds:
                    gened_obj = GenEd.objects.get(code=gened)
                    course_obj.geneds.add(gened_obj)

                sections = scraper.get_sections(semester, course['code'])
                for section in sections:

                    section_obj, _ = Section.objects.update_or_create(
                        code=section['code'],
                        course=course_obj
                    )

                    professors = section['professors']
                    for professor in professors:
                        professor_obj, _ = Professor.objects.get_or_create(name=professor)
                        section_obj.professors.add(professor_obj)

                    Day.objects.create(
                        day=day,
                        total_seats=section['total_seats'],
                        open_seats=section['open_seats'],
                        waitlist_seats=section['waitlist_seats'],
                        holdfile_seats=section['holdfile_seats'],
                        semester=semester,
                        section=section_obj
                    )
