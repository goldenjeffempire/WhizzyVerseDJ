import csv
from io import StringIO
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.units import inch


def export_analytics_csv(analytics):
    """Export analytics data as CSV"""
    output = StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['WhizzyVerse Analytics Report'])
    writer.writerow([])
    writer.writerow(['Date', analytics.date])
    writer.writerow([])
    writer.writerow(['Metric', 'Value'])
    writer.writerow(['Page Views', analytics.page_views])
    writer.writerow(['Track Plays', analytics.track_plays])
    writer.writerow(['Chat Sessions', analytics.chat_sessions])
    writer.writerow(['Total Fans', analytics.total_fans])
    writer.writerow(['Merch Views', analytics.merch_views])
    writer.writerow(['Event Views', analytics.event_views])
    
    csv_content = output.getvalue()
    response = HttpResponse(csv_content.encode('utf-8'), content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="whizzyverse_analytics.csv"'
    
    return response


def export_analytics_pdf(analytics):
    """Export analytics data as PDF"""
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="whizzyverse_analytics.pdf"'
    
    doc = SimpleDocTemplate(response, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    title = Paragraph('<b>WhizzyVerse Analytics Report</b>', styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 0.3 * inch))
    
    subtitle = Paragraph(f'Report Date: {analytics.date}', styles['Normal'])
    elements.append(subtitle)
    elements.append(Spacer(1, 0.3 * inch))
    
    data = [
        ['Metric', 'Value'],
        ['Page Views', str(analytics.page_views)],
        ['Track Plays', str(analytics.track_plays)],
        ['Chat Sessions', str(analytics.chat_sessions)],
        ['Total Fans', str(analytics.total_fans)],
        ['Merch Views', str(analytics.merch_views)],
        ['Event Views', str(analytics.event_views)],
    ]
    
    table = Table(data, colWidths=[4 * inch, 2 * inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7A00FF')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    
    doc.build(elements)
    
    return response
