import requests
from bs4 import BeautifulSoup
import re

BASE_URL = 'https://app.testudo.umd.edu/soc/'


# scrapes Testudo for departments
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


# helper method that removes leading and trailing whitespaces
def _remove_whitespace(text):
    text = re.sub('^\s+', '', text)
    text = re.sub('\s+$', '', text)
    return text


# scrapes Testudo for gened types
def get_geneds():
    geneds = list()

    page = requests.get(f'{BASE_URL}gen-ed').text
    soup = BeautifulSoup(page, 'html.parser')
    geneds_soup = soup.find_all(class_='subcategory')

    for gened in geneds_soup:
        code = re.search('(?<=\()\w{4}(?=\))', _remove_whitespace(gened.text)).group()
        name = re.search('^(.+?)(?=\s\()', _remove_whitespace(gened.text)).group()

        geneds.append({'code': code, 'name': name})

    return geneds


# scrapes Testudo for courses by department
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
            geneds.append(_remove_whitespace(gened.find('a').text))

        # not all courses have 'approved-course-text'
        try:
            description = course.find(class_='approved-course-text').text
        except:
            description = ''

        courses.append({'code': code, 'name': name, 'geneds': geneds, 'description': description})

    return courses


# scrapes Testudo for sections byy course
def get_sections(semester, course):
    sections = list()

    page = requests.get(f'{BASE_URL}{semester}/{course[:4]}/{course}').text
    soup = BeautifulSoup(page, 'html.parser')
    course_soup = soup.find(id=course)

    # not all courses have sections
    try:
        sections_soup = course_soup.find_all(class_='section')
    except:
        sections_soup = []

    for section in sections_soup:
        code = section.find(class_='section-id').text
        total_seats = section.find(class_='total-seats-count').text
        open_seats = section.find(class_='open-seats-count').text

        # both waitlist and holdfile use 'waitlist-count' class
        waitlist_holdfile = section.find_all(class_='waitlist-count')
        waitlist_seats = waitlist_holdfile[0].text

        # not all sections have holdfiles
        try:
            holdfile_seats = waitlist_holdfile[1].text
        except:
            holdfile_seats = 0

        professors = list()
        professors_soup = section.find_all(class_='section-instructor')
        for professor in professors_soup:
            professors.append(professor.text)

        sections.append({
            'code': _remove_whitespace(code),
            'professors': professors,
            'total_seats': total_seats,
            'open_seats': open_seats,
            'waitlist_seats': waitlist_seats,
            'holdfile_seats': holdfile_seats
        })

    return sections
