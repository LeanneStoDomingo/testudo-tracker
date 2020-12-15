from django.db import models

# Create your models here.

class Department(models.Model):
    code = models.CharField(max_length=4)
    name = models.CharField(max_length=50)

class Course(models.Model):
    code = models.CharField(max_length=8)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=500)
    department_id = models.ForeignKey(Department, on_delete=models.PROTECT)

class Section(models.Model):
    code = models.CharField(max_length=4)
    course_id = models.ForeignKey(Course, on_delete=models.PROTECT)

class Professor(models.Model):
    name = models.CharField(max_length=50)

class Day(models.Model):
    day = models.IntegerField()
    semester = models.IntegerField()
    total_seats = models.IntegerField()
    open_seats = models.IntegerField()
    waitlist_seats = models.IntegerField()
    holdfile_seats = models.IntegerField()
    professor_id = models.ForeignKey(Professor, on_delete=models.PROTECT)
    section_id = models.ForeignKey(Section, on_delete=models.PROTECT)