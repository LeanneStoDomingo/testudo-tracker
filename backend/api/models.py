from django.db import models

# Create your models here.


class Department(models.Model):
    code = models.CharField(max_length=4, unique=True)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return self.code


class GenEd(models.Model):
    code = models.CharField(max_length=4, unique=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.code


class Course(models.Model):
    code = models.CharField(max_length=8, unique=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    gened = models.ManyToManyField(GenEd)

    class Meta:
        ordering = ['code']

    def __str__(self):
        return self.code


class Semester(models.Model):
    year = models.IntegerField()
    season = models.CharField(max_length=2, choices=((1, '01'), (2, '08')))

    def __str__(self):
        return f'{str(self.year)}{self.season}'


class Section(models.Model):
    code = models.CharField(max_length=4)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)

    def __str__(self):
        return self.code


class Professor(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Day(models.Model):
    day = models.IntegerField()
    total_seats = models.IntegerField()
    open_seats = models.IntegerField()
    waitlist_seats = models.IntegerField()
    holdfile_seats = models.IntegerField()
    semester = models.ForeignKey(Semester, on_delete=models.PROTECT)
    professor = models.ForeignKey(Professor, on_delete=models.PROTECT)
    section = models.ForeignKey(Section, on_delete=models.PROTECT)
