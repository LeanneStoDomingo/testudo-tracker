import requests
from bs4 import BeautifulSoup

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


def get_courses(semester, department):
    courses = list()

    page = requests.get(f'{BASE_URL}{semester}/{department}').text
    soup = BeautifulSoup(page, 'html.parser')
    courses_soup = soup.find_all(class_='course')

    for course in courses_soup:
        code = course.find(class_='course-id').text
        name = course.find(class_='course-title').text
        description = course.find(class_='approved-course-text').text
        courses.append({'code': code, 'name': name, 'description': description})

    return courses


def get_sections():
    pass
