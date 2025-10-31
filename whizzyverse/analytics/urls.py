from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('dashboard/', views.analytics_dashboard_view, name='dashboard'),
    path('export/csv/', views.export_csv_view, name='export_csv'),
    path('export/pdf/', views.export_pdf_view, name='export_pdf'),
]
