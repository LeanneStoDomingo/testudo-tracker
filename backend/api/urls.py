from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    path('departments/<int:dept_id>/', views.get_department),
    path('courses/<int:course_id>/', views.get_course),
    path('professors/<int:prof_id>/', views.get_professor),
    path('geneds/<int:gened_id>/', views.get_gened),
    path('search/', views.search)
]
