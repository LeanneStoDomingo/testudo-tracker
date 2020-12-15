from django.db import models

# Create your models here.


class Department(models.Model):
    code = models.CharField(max_length=4, unique=True)
    name = models.CharField(max_length=100)


class Course(models.Model):
    code = models.CharField(max_length=8, unique=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    department_id = models.ForeignKey(Department, on_delete=models.PROTECT)


class Section(models.Model):
    code = models.CharField(max_length=4)
    course_id = models.ForeignKey(Course, on_delete=models.PROTECT)


class Professor(models.Model):
    name = models.CharField(max_length=100, unique=True)


class Day(models.Model):
    day = models.IntegerField()
    semester = models.IntegerField()
    total_seats = models.IntegerField()
    open_seats = models.IntegerField()
    waitlist_seats = models.IntegerField()
    holdfile_seats = models.IntegerField()
    professor_id = models.ForeignKey(Professor, on_delete=models.PROTECT)
    section_id = models.ForeignKey(Section, on_delete=models.PROTECT)
