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


def get_courses():
    pass


def get_sections():
    pass
