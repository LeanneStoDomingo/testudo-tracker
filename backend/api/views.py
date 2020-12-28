from django.db.models.aggregates import Max, Sum
from django.http.response import JsonResponse
from .models import *

# Create your views here.


def homepage(request):
    return JsonResponse({
        'homepage': 'This is the private GETful API for Testudo Tracker.'
    })


def _list_seats(days):
    total_seats = list()
    open_seats = list()
    waitlist_seats = list()
    holdfile_seats = list()

    # TODO: filter out current semster scrapings
    # TODO: list of number of sections per day

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

    return {
        'total_seats': total_seats,
        'open_seats': open_seats,
        'waitlist_seats': waitlist_seats,
        'holdfile_seats': holdfile_seats
    }


def list_departments(request):
    department_objs = Department.objects.all()
    departments = list(department_objs.values())
    res = {'departments': departments}
    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_department(request, dept_id):
    department = Department.objects.get(id=dept_id)
    course_objs = Course.objects.filter(department=department)
    section_objs = Section.objects.filter(course__in=course_objs)
    days = Day.objects.filter(section__in=section_objs)

    res = {
        'id': department.id,
        'code': department.code,
        'name': department.name,
        'seats': _list_seats(days),
        'courses': list(course_objs.values('id', 'code', 'name'))
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_course(request, course_id):
    pass


def list_professors(request):
    professor_objs = Professor.objects.all()
    professors = list(professor_objs.values())
    res = {'professors': professors}
    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_professor(request, prof_id):
    professor = Professor.objects.get(id=prof_id)
    section_objs = Section.objects.filter(professors=professor)
    course_objs = Course.objects.filter(section__in=section_objs)
    days = Day.objects.filter(section__in=section_objs)

    res = {
        'id': professor.id,
        'name': professor.name,
        'seats': _list_seats(days),
        'courses': list(course_objs.distinct().values('id', 'code', 'name'))
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})


def list_geneds(request):
    gened_objs = GenEd.objects.all()
    geneds = list(gened_objs.values())
    res = {'geneds': geneds}
    return JsonResponse(res, json_dumps_params={'indent': 2})


def get_gened(request, gened_id):
    gened = GenEd.objects.get(id=gened_id)
    course_objs = Course.objects.filter(geneds=gened)
    section_objs = Section.objects.filter(course__in=course_objs)
    days = Day.objects.filter(section__in=section_objs)

    res = {
        'id': gened.id,
        'code': gened.code,
        'name': gened.name,
        'seats': _list_seats(days),
        'courses': list(course_objs.values('id', 'code', 'name'))
    }

    return JsonResponse(res, json_dumps_params={'indent': 2})
