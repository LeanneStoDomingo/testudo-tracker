from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    path('departments/<str:dept_code>/', views.get_department),
    path('courses/<str:course_code>/', views.get_course),
    path('professors/<slug:prof_slug>/', views.get_professor),
    path('geneds/<str:gened_code>/', views.get_gened),
    path('search/', views.search)
]
