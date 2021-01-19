from django.db.models.aggregates import Max, Sum
from django.http.response import JsonResponse
from django.utils.text import slugify
from .models import *

# Create your views here.

# TODO: look into optimizing queries to database by using list(objects.values/values_list()) when doing __in queries
# https://docs.djangoproject.com/en/3.1/ref/models/querysets/ (ctrl+f "__in")


def homepage(request):
    return JsonResponse({
        'homepage': 'This is the private GETful API for Testudo Tracker.'
    })


def _list_seats(days, sections):
    total_seats = list()
    open_seats = list()
    waitlist_seats = list()
    holdfile_seats = list()
    num_sections = list()

    # TODO: filter out current semster scrapings

    nums = days.aggregate(Max('day'))
    for i in range(nums['day__max'] + 1):
        day = days.filter(day=i).aggregate(
            Sum('total_seats'),
            Sum('open_seats'),
            Sum('waitlist_seats'),
            Sum('holdfile_seats')
        )

        total_seats.append(day['total_seats__sum'] or 0)
        open_seats.append(day['open_seats__sum'] or 0)
        waitlist_seats.append(day['waitlist_seats__sum'] or 0)
        holdfile_seats.append(day['holdfile_seats__sum'] or 0)
        num_sections.append(sections.filter(day__in=days.filter(day=i)).count())

    res = {
        'total_seats': total_seats,
        'open_seats': open_seats,
        'waitlist_seats': waitlist_seats,
        'holdfile_seats': holdfile_seats
    }

    return res, num_sections


def get_department(request, dept_id):
    department = Department.objects.get(id=dept_id)
    course_objs = Course.objects.filter(department=department)
    section_objs = Section.objects.filter(course__in=course_objs)
    days = Day.objects.filter(section__in=section_objs)

    seats, num_sections = _list_seats(days, section_objs)

    res = {
        'id': dept_id,
        'code': department.code,
        'name': department.name,
        'seats': seats,
        'num_sections': num_sections,
        'courses': list(course_objs.values('id', 'code', 'name'))
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_course(request, course_id):
    sections_query = request.GET.getlist('sections')
    professors_query = request.GET.getlist('professors')
    semesters_query = request.GET.getlist('semesters')

    course = Course.objects.get(id=course_id)
    sections = Section.objects.filter(course=course)
    professors = Professor.objects.filter(section__in=sections).distinct()
    semesters = Semester.objects.filter(section__in=sections).distinct()

    filters = {
        'semesters': list(semesters.values('id', 'year', 'month')),
        'professors': list(professors.values('id', 'name')),
        'sections': list(sections.values('id', 'code'))
    }

    if sections_query:
        sections = sections.filter(id__in=sections_query)

    if professors_query:
        professors = professors.filter(id__in=professors_query)

    if semesters_query:
        semesters = semesters.filter(id__in=semesters_query)

    sections = sections.filter(professors__in=professors).filter(semester__in=semesters)
    days = Day.objects.filter(section__in=sections)

    seats, num_sections = _list_seats(days, sections)

    res = {
        'id': course_id,
        'code': course.code,
        'name': course.name,
        'seats': seats,
        'num_sections': num_sections,
        'filters': filters
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_professor(request, prof_id):
    professor = Professor.objects.get(id=prof_id)
    section_objs = Section.objects.filter(professors=professor)
    course_objs = Course.objects.filter(section__in=section_objs)
    days = Day.objects.filter(section__in=section_objs)

    seats, num_sections = _list_seats(days, section_objs)

    res = {
        'id': prof_id,
        'name': professor.name,
        'seats': seats,
        'num_sections': num_sections,
        'courses': list(course_objs.distinct().values('id', 'code', 'name'))
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_gened(request, gened_id):
    gened = GenEd.objects.get(id=gened_id)
    course_objs = Course.objects.filter(geneds=gened)
    section_objs = Section.objects.filter(course__in=course_objs)
    days = Day.objects.filter(section__in=section_objs)

    seats, num_sections = _list_seats(days, section_objs)

    res = {
        'id': gened_id,
        'code': gened.code,
        'name': gened.name,
        'seats': seats,
        'num_sections': num_sections,
        'courses': list(course_objs.values('id', 'code', 'name'))
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})


def search(request):
    department_objs = Department.objects.all()
    departments = list(department_objs.values())
    departments = [{**department, 'link': f'/departments/{department["code"]}',
                    'text': f'{department["code"]} {department["name"]}'} for department in departments]

    gened_objs = GenEd.objects.all()
    geneds = list(gened_objs.values())
    geneds = [{**gened, 'link': f'/geneds/{gened["code"]}',
               'text': f'{gened["code"]} {gened["name"]}'} for gened in geneds]

    course_objs = Course.objects.all()
    courses = list(course_objs.values('id', 'code', 'name'))
    courses = [{**course, 'link': f'/courses/{course["code"]}',
                'text': f'{course["code"]} {course["name"]}'} for course in courses]

    professor_objs = Professor.objects.all()
    professors = list(professor_objs.values())
    professors = [{**professor, 'link': f'/professors/{slugify(professor["name"])}',
                   'text': f'{professor["name"]}'} for professor in professors]

    res = {
        'data': departments + geneds + courses + professors
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})
