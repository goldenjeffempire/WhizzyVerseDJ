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
    writer.writerow(['Metric', 'Value'])
    writer.writerow(['Total Page Views', analytics.total_page_views])
    writer.writerow(['Total Track Plays', analytics.total_track_plays])
    writer.writerow(['Total Chat Sessions', analytics.total_chat_sessions])
    writer.writerow(['Newsletter Subscribers', analytics.total_newsletter_subscribers])
    writer.writerow(['Contact Messages', analytics.total_contact_messages])
    writer.writerow([])
    writer.writerow(['Most Viewed Pages'])
    for page, count in analytics.page_views.items():
        writer.writerow([page, count])
    
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
    
    data = [
        ['Metric', 'Value'],
        ['Total Page Views', str(analytics.total_page_views)],
        ['Total Track Plays', str(analytics.total_track_plays)],
        ['Total Chat Sessions', str(analytics.total_chat_sessions)],
        ['Newsletter Subscribers', str(analytics.total_newsletter_subscribers)],
        ['Contact Messages', str(analytics.total_contact_messages)],
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
    elements.append(Spacer(1, 0.5 * inch))
    
    if analytics.page_views:
        page_views_title = Paragraph('<b>Most Viewed Pages</b>', styles['Heading2'])
        elements.append(page_views_title)
        elements.append(Spacer(1, 0.2 * inch))
        
        page_data = [['Page', 'Views']]
        for page, count in sorted(analytics.page_views.items(), key=lambda x: x[1], reverse=True)[:10]:
            page_data.append([page, str(count)])
        
        page_table = Table(page_data, colWidths=[4 * inch, 2 * inch])
        page_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00E0FF')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(page_table)
    
    doc.build(elements)
    
    return response
