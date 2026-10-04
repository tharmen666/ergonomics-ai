import sys
import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
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
        # Top banner accent line
        self.setFillColor(colors.HexColor("#1E3A8A")) # Deep Royal Navy
        self.rect(0, 832, 595.27, 10, fill=True, stroke=False)
        self.setFillColor(colors.HexColor("#2563EB")) # Electric Blue accent bar
        self.rect(0, 828, 595.27, 4, fill=True, stroke=False)
        
        # Bottom footer accent line & text
        self.setFillColor(colors.HexColor("#CBD5E1"))
        self.rect(36, 32, 523.27, 0.75, fill=True, stroke=False)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        self.drawString(36, 20, "ErgoSafe Reborn V3 — Workplace Health, Safety & Compliance Platform")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559.27, 20, page_text)
        self.restoreState()

def create_overview_pdf(output_path):
    # Set up A4 Document with 0.4 inch (28.8 pt) margins to fit everything neatly on 1 page
    margin = 32
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=40,
        bottomMargin=40
    )

    usable_width = 595.27 - (2 * margin) # 531.27 pt

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#2563EB"),
        spaceAfter=8
    )

    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=14,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=6,
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

    body_bold = ParagraphStyle(
        'BodyBoldCustom',
        parent=body_style,
        fontName='Helvetica-Bold',
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=10,
        firstLineIndent=-10,
        spaceAfter=3
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#1E293B"),
        alignment=1 # Center
    )

    story = []

    # Title & Header Block
    header_data = [
        [
            Paragraph("<b>ErgoSafe Reborn V3</b>", title_style),
            Paragraph("<b>STATUS: PRODUCTION READY</b><br/><font color='#64748B'>Ver: 3.0.0 | ISO 45001/45003</font>", badge_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[usable_width - 130, 130])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (1,0), (1,0), 0.5, colors.HexColor("#CBD5E1")),
        ('BOTTOMPADDING', (1,0), (1,0), 4),
        ('TOPPADDING', (1,0), (1,0), 4),
        ('LEFTPADDING', (1,0), (1,0), 6),
        ('RIGHTPADDING', (1,0), (1,0), 6),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 2))
    story.append(Paragraph("EXECUTIVE & TECHNICAL SYSTEM OVERVIEW", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceBefore=1, spaceAfter=6))

    # SECTION 1: SIMPLE EXPLANATION
    story.append(Paragraph("1. Simple Explanation: What Does ErgoSafe Reborn V3 Do?", h1_style))
    story.append(Paragraph(
        "<b>ErgoSafe Reborn V3</b> is an intelligent, AI-driven <b>Workplace Ergonomics, Driver Fatigue Telemetry, and Occupational Health & Safety (OHS) Compliance System</b>. "
        "It acts as a digital safety guardian for modern hybrid work environments and transport fleets. Its core mission is to <b>prevent physical injuries</b> (such as tech-neck, lumbar strain, and posture-induced musculoskeletal disorders), <b>detect driver fatigue before accidents occur</b>, and <b>protect organizations from statutory legal liability</b> under South African safety regulations.",
        body_style
    ))

    features = [
        ("3D Biomechanical Posture Tracking (Nelly Engine)", "Uses spatial vision & real-time 3D spine visualization to evaluate desk posture (slouching, bed/couch working, monitor height mismatch). It calculates real-time neck load (e.g., tech-neck flexion shifting cervical load from 12 lbs to 60 lbs)."),
        ("Driver Shift & Fatigue Telemetry (Shandray's Prizm)", "Continuously tracks long-distance driver hours and reaction time drop percentages. Automatically triggers high-priority Prizm alerts instructing drivers when power rests are mandatory."),
        ("OHS Act Section 37 & ISO Audit Ledger", "Automatically logs safety hazards, posture breaches, and fatigue incidents into an administrative ledger, safeguarding company directors under Section 37 of the OHS Act 85 of 1993."),
        ("Multilingual Nelly Voice Assistant", "Provides real-time voice triage and ergonomic guidance across 7 regional languages (isiZulu, isiXhosa, Sesotho, English, German, Mandarin, KiSwahili) with native accent routing."),
        ("Behavior-Based Safety (BBS) Micro-Interventions", "Triggers immediate interactive corrective actions upon detecting hazards—such as 15-second postural reset stretches, 60-second power breathing, and 20-20-20 ocular breaks.")
    ]

    for title, desc in features:
        story.append(Paragraph(f"• <b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E2E8F0"), spaceBefore=2, spaceAfter=6))

    # SECTION 2: TECHNICAL EXPLANATION
    story.append(Paragraph("2. Technical Explanation: Architecture & Implementation Details", h1_style))
    story.append(Paragraph(
        "ErgoSafe Reborn V3 is architected as a high-performance, single-page reactive web application (SPA) with real-time 3D rendering and RESTful telemetry integration.",
        body_style
    ))

    # Tech Stack Table
    tech_data = [
        [Paragraph("<b>Layer</b>", body_bold), Paragraph("<b>Technologies & Libraries</b>", body_bold), Paragraph("<b>Implementation Details</b>", body_bold)],
        [
            Paragraph("<b>Frontend Core</b>", body_style),
            Paragraph("React 18, TypeScript, Vite, Tailwind CSS v3", body_style),
            Paragraph("Component-driven SPA architecture with ultra-fast Vite HMR and dynamic dark/glassmorphic UI styling.", body_style)
        ],
        [
            Paragraph("<b>3D Graphics & Telemetry</b>", body_style),
            Paragraph("Three.js, @react-three/fiber, @react-three/drei", body_style),
            Paragraph("Interactive 3D spinal column model (SpineViewer.tsx) rendering real-time biomechanical angles and load metrics.", body_style)
        ],
        [
            Paragraph("<b>State & Audit Ledger</b>", body_style),
            Paragraph("Zustand (Global Reactive State)", body_style),
            Paragraph("Centralized state store (useComplianceStore) managing hazard events, verified BBS interventions, and audit logs.", body_style)
        ],
        [
            Paragraph("<b>API & Telemetry</b>", body_style),
            Paragraph("RESTful Handshake Protocol (/api/v1/fatigue-score)", body_style),
            Paragraph("POST endpoint accepting driver telemetry (drivingHours, reactionTimes, reactionDropPct) to return Prizm alerts.", body_style)
        ],
        [
            Paragraph("<b>Voice & Accent Engine</b>", body_style),
            Paragraph("Native Web Speech API (src/utils/speech.ts)", body_style),
            Paragraph("Multilingual speech synthesis supporting pitch/rate modulation and voice routing across 7 international locales.", body_style)
        ],
    ]

    t_tech = Table(tech_data, colWidths=[100, 160, usable_width - 260])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F8FAFC")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 6))

    # Core Navigation Modules Table / Summary
    story.append(Paragraph("<b>Primary Application Modules (6-Item Architecture Standard):</b>", body_bold))
    
    modules_text = (
        "<b>1. HR & Compliance Dashboard:</b> Section 37 risk tracking & escalation workflows. | "
        "<b>2. Ergonomics Training:</b> Interactive self-evaluations & certifications. | "
        "<b>3. Daily Assessment:</b> Telemetry checklists & MediaPipe spatial vision. | "
        "<b>4. Nelly Posture Engine:</b> Biomechanical hazard monitoring & tech-neck detection. | "
        "<b>5. Driver Fatigue Telemetry:</b> Shandray Prizm driving-hour & reaction-drop scoring. | "
        "<b>6. Regulatory Audit Logs:</b> Zero-knowledge compliance dossiers & ISO audit trails."
    )
    story.append(Paragraph(modules_text, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {output_path}")

if __name__ == '__main__':
    desktop_path = r"C:\Users\Desigan Tharmen\Desktop\ErgoSafe_App_Overview.pdf"
    create_overview_pdf(desktop_path)
