from django.core.management.base import BaseCommand
from ...models import Course, Day, Department, GenEd, Professor, Section, Semester
from . import _scraper as scraper
from datetime import date


class Command(BaseCommand):
    help = 'Populates the database with information from Testudo.'

    def handle(self, *args, **options):
        semester_obj = Semester.objects.latest('start_date')
        start_date = getattr(semester_obj, 'start_date')
        end_date = getattr(semester_obj, 'end_date')
        day = (date.today() - start_date).days

        if ((end_date - date.today()).days < 0 or day < 0):
            return

        # retrieves departments from Department table
        department_objs = Department.objects.all()
        for department_obj in department_objs:

            # scrapes Testudo for courses by department
            courses = scraper.get_courses(str(semester_obj), str(department_obj))
            for course in courses:

                # updates course if it already exists, otherwise add to Course table
                course_obj, _ = Course.objects.update_or_create(
                    code=course['code'],
                    name=course['name'],
                    description=course['description'],
                    department=department_obj
                )

                # adds geneds to course if there are any
                geneds = course['geneds']
                for gened in geneds:
                    gened_obj = GenEd.objects.get(code=gened)
                    course_obj.geneds.add(gened_obj)

                # scrapes Testudo for sections by course
                sections = scraper.get_sections(str(semester_obj), str(course_obj))
                for section in sections:

                    # retrieves section if it already exists, otherwise add to Section table
                    section_obj, _ = Section.objects.get_or_create(
                        code=section['code'],
                        course=course_obj,
                        semester=semester_obj
                    )

                    # adds professors to section
                    professors = section['professors']
                    for professor in professors:
                        professor_obj, _ = Professor.objects.get_or_create(name=professor)
                        section_obj.professors.add(professor_obj)

                    # adds new day object for each section
                    Day.objects.create(
                        day=day,
                        total_seats=section['total_seats'],
                        open_seats=section['open_seats'],
                        waitlist_seats=section['waitlist_seats'],
                        holdfile_seats=section['holdfile_seats'],
                        section=section_obj
                    )
