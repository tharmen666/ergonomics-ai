import React from "react";

export default function ErgonomicsKit() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-md" style={{background:"#fff",borderRadius:16,boxShadow:"0 8px 24px rgba(0,0,0,0.06)"}}>
      <h1 className="text-3xl font-bold mb-4" style={{fontWeight:800,fontSize:28,marginBottom:16}}>
        Ergonomic Training Package for HR: Assessment, Certification, Presentation, and Compliance Tools
      </h1>

      <h2 style={{fontWeight:700,fontSize:20,marginTop:24,marginBottom:12}}>🧪 1. Employee Ergonomic Assessment Tool</h2>
      <p><strong>Purpose:</strong> Evaluate workstation setup and ergonomic awareness.</p>

      <table style={{borderCollapse:"collapse",width:"100%",fontSize:14,margin:"16px 0"}}>
        <thead>
          <tr style={{background:"#f1f5f9"}}>
            <th style={{border:"1px solid #cbd5e1",padding:"6px"}}>Item</th>
            <th style={{border:"1px solid #cbd5e1",padding:"6px"}}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Chair height</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Feet flat, knees at 90°</td></tr>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Monitor position</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Eye level, arm’s length</td></tr>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Keyboard/mouse</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Elbows at 90°, wrists straight</td></tr>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Lighting</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>No glare, adequate brightness</td></tr>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Breaks</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Taken every 2 hours</td></tr>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Stretching</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Daily routine followed</td></tr>
          <tr><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Reporting</td><td style={{border:"1px solid #cbd5e1",padding:"6px"}}>Knows how to report discomfort</td></tr>
        </tbody>
      </table>

      <p><strong>Scoring Guide:</strong></p>
      <ul style={{marginLeft:20}}>
        <li>30–35: Excellent</li>
        <li>20–29: Needs improvement</li>
        <li>Below 20: At risk – HR follow-up required</li>
      </ul>

      <h2 style={{fontWeight:700,fontSize:20,marginTop:24,marginBottom:12}}>🎓 2. Certificate of Attendance Template</h2>
      <blockquote style={{borderLeft:"4px solid #60a5fa",paddingLeft:12,color:"#334155"}}>
        This certifies that [Employee Name] has successfully completed the Workplace Ergonomics Training Program on [Date], in compliance with South Africa’s Ergonomics Regulations under the Occupational Health and Safety Act.
      </blockquote>
      <p><strong>Signed by:</strong> HR Manager<br/>Astron Energy</p>

      <h2 style={{fontWeight:700,fontSize:20,marginTop:24,marginBottom:12}}>📊 3. PowerPoint Presentation Script</h2>
      <p><strong>Slide 1:</strong> Title — Workplace Ergonomics Training. “Protecting your health, wherever you work.”</p>
      <p><strong>Voiceover:</strong> Welcome to your ergonomic safety training...</p>
      <p><strong>Slide 2–8:</strong> Add bullet points from the markdown file — ergonomics definition, hazards, injuries, breaks, and compliance law.</p>

      <h2 style={{fontWeight:700,fontSize:20,marginTop:24,marginBottom:12}}>🎬 4. Animated Video Script (Remote Workers)</h2>
      <p>Short 3–4 min story: bad posture → discomfort → fix setup → report → certification earned. Use clear visuals and SA workplace context.</p>

      <h2 style={{fontWeight:700,fontSize:20,marginTop:24,marginBottom:12}}>🛠️ 5. HR Tracking & Reporting System</h2>
      <ul style={{marginLeft:20}}>
        <li>✅ Training completion log</li>
        <li>✅ Assessment score tracking</li>
        <li>✅ Certificate issuance log</li>
        <li>✅ Monthly compliance dashboard</li>
      </ul>
    </div>
  );
}
