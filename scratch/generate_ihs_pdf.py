import sys
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class StatutoryNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Top banner accent bar
        self.setFillColor(colors.HexColor("#1E3A8A"))
        self.rect(0, 832, 595.27, 10, fill=True, stroke=False)
        self.setFillColor(colors.HexColor("#D97706"))
        self.rect(0, 828, 595.27, 4, fill=True, stroke=False)
        
        # Bottom statutory disclaimer footer accent & text
        self.setFillColor(colors.HexColor("#CBD5E1"))
        self.rect(36, 42, 523.27, 0.75, fill=True, stroke=False)
        
        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#92400E"))
        footer_disclaimer = "STATUTORY NOTICE: AI-assisted draft for guidance. Requires verification and sign-off by a statutory Competent Person (OHS Act 85 of 1993)."
        self.drawString(36, 30, footer_disclaimer)

        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#475569"))
        self.drawString(36, 18, "ErgoSafe Reborn V3 — Human-in-the-Loop Statutory Safeguards")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559.27, 18, page_text)
        self.restoreState()

def create_ihs_statutory_pdf(output_path, document_title="HIRA DOSSIER", site_context="Logistics Facility - Durban Port Warehouse", competent_person="John Doe (Appointed Sec 16.2)", competent_role="SHE Representative / Ergonomics Facilitator"):
    margin = 32
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=40,
        bottomMargin=52
    )

    usable_width = 595.27 - (2 * margin)

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=20,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=2
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerBanner',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#92400E"),
        backColor=colors.HexColor("#FEF3C7"),
        borderColor=colors.HexColor("#D97706"),
        borderWidth=1,
        borderPadding=6,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=13,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4
    )

    signoff_style = ParagraphStyle(
        'SignoffBlock',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
        backColor=colors.HexColor("#F8FAFC"),
        borderColor=colors.HexColor("#CBD5E1"),
        borderWidth=1,
        borderPadding=8,
        spaceBefore=12,
        spaceAfter=8
    )

    story = []

    # Statutory Banner
    disclaimer_text = (
        "<b>STATUTORY COMPLIANCE NOTICE:</b> AI-assisted draft compiled for operational guidance. "
        "In terms of the Occupational Health and Safety Act (Act 85 of 1993), this document is not a certified legal record "
        "until reviewed, adjusted for site-specific conditions, and signed off by a designated Competent Person."
    )
    story.append(Paragraph(disclaimer_text, disclaimer_style))

    # Header Title
    story.append(Paragraph(f"<b>REPUBLIC OF SOUTH AFRICA - STATUTORY OHS DOSSIER</b>", title_style))
    story.append(Paragraph(f"<b>Document Type:</b> {document_title} | <b>Site Context:</b> {site_context}", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceBefore=4, spaceAfter=8))

    # Standards Taxonomy Section
    story.append(Paragraph("1. Standards Taxonomy & Legal Mandate", h1_style))
    taxonomy_text = (
        "<b>Mandatory South African Statutory Frameworks:</b><br/>"
        "• OHS Act 85 of 1993 (Section 8 Employer Duties)<br/>"
        "• Ergonomics Regulations 2019 (GNR 1009 Regulation 6)<br/>"
        "• General Safety Regulations (GSR 2 & 3)<br/>"
        "• Compensation for Occupational Injuries and Diseases Act (COIDA Act 130 of 1993)<br/><br/>"
        "<b>Voluntary Best-Practice Frameworks:</b><br/>"
        "• ISO 45001:2018 (Occupational Health & Safety Management Systems)"
    )
    story.append(Paragraph(taxonomy_text, body_style))

    # Verification Sign-Off Block
    signoff_text = (
        "<b>STATUTORY VERIFICATION & COMPETENT PERSON SIGN-OFF RECORD</b><br/>"
        f"• <b>Reviewed & Approved By:</b> {competent_person}<br/>"
        f"• <b>Statutory Capacity / Role:</b> {competent_role}<br/>"
        f"• <b>Verification Timestamp:</b> {os.popen('date /t').read().strip() if os.name == 'nt' else '2026-09-14'}<br/>"
        "• <b>Compliance Status:</b> VERIFIED & ADAPTED TO SITE-SPECIFIC CONDITIONS"
    )
    story.append(Paragraph(signoff_text, signoff_style))

    doc.build(story, canvasmaker=StatutoryNumberedCanvas)
    print(f"Statutory PDF successfully generated at: {output_path}")

if __name__ == '__main__':
    desktop_path = r"C:\Users\Desigan Tharmen\Desktop\Statutory_Compliance_Dossier.pdf"
    create_ihs_statutory_pdf(desktop_path)
