import requests
from bs4 import BeautifulSoup
import re

BASE_URL = 'https://app.testudo.umd.edu/soc/'


def get_departments():
    departments = list()

    page = requests.get(BASE_URL).text
    soup = BeautifulSoup(page, 'html.parser')
    departments_soup = soup.find_all(class_='course-prefix')

    for department in departments_soup:
        code = department.find(class_='prefix-abbrev').text
        name = department.find(class_='prefix-name').text

        departments.append({'code': code, 'name': name})

    return departments


def _remove_whitespace(text):
    text = re.sub('^\s+', '', text)
    text = re.sub('\s+$', '', text)
    return text


def get_geneds():
    geneds = list()

    page = requests.get(f'{BASE_URL}gen-ed').text
    soup = BeautifulSoup(page, 'html.parser')
    geneds_soup = soup.find_all(class_='subcategory')

    for gened in geneds_soup:
        code = re.search('(?<=\()\w{4}(?=\))', _remove_whitespace(gened.text)).group()
        name = re.search('^(.+?)(?=\s\()', _remove_whitespace(gened.text)).group()

        geneds.append({'code': code, 'name': name})


def get_courses(semester, department):
    courses = list()

    page = requests.get(f'{BASE_URL}{semester}/{department}').text
    soup = BeautifulSoup(page, 'html.parser')
    courses_soup = soup.find_all(class_='course')

    for course in courses_soup:
        code = course.find(class_='course-id').text
        name = course.find(class_='course-title').text

        geneds = list()
        geneds_soup = course.find_all(class_='course-subcategory')
        for gened in geneds_soup:
            geneds.append(gened.text)

        description = course.find(class_='approved-course-text').text

        courses.append({'code': code, 'name': name, 'geneds': geneds, 'description': description})

    return courses


def get_sections(semester, course):
    sections = list()

    page = requests.get(f'{BASE_URL}{semester}/{course[:4]}/{course}').text
    soup = BeautifulSoup(page, 'html.parser')
    course_soup = soup.find(id=course)
    sections_soup = course_soup.find_all(class_='section')

    for section in sections_soup:
        code = section.find(class_='section-id').text
        total_seats = section.find(class_='').text
        open_seats = section.find(class_='').text
        waitlist = section.find(class_='').text
        holdfile = section.find(class_='').text

        professors = list()
        professors_soup = section.find_all(class_='section-instructor')
        for professor in professors_soup:
            professors.append(professor.text)

        sections.append({
            'code': code,
            'professors': professors,
            'total_seats': total_seats,
            'open_seats': open_seats,
            'waitlist': waitlist,
            'holdfile': holdfile
        })

    return sections
