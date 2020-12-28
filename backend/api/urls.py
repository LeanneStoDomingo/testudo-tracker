from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    path('departments/', views.list_departments),
    path('departments/<int:dept_id>/', views.get_department),
    path('courses/<int:course_id>/', views.get_course),
    path('professors/', views.list_professors),
    path('professors/<int:prof_id>/', views.get_professor),
    path('geneds/', views.list_geneds),
    path('geneds/<int:gened_id>/', views.get_gened)
]
