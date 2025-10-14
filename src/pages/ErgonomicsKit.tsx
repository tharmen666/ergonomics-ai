import React from "react";

export default function ErgonomicsKit() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Ergonomic Training Package for HR: Assessment, Certification, Presentation, and Compliance Tools
      </h1>

      <h2 className="text-2xl font-semibold mt-6 mb-3">🧪 1. Employee Ergonomic Assessment Tool</h2>
      <p><strong>Purpose:</strong> Evaluate workstation setup and ergonomic awareness.</p>

      <table className="table-auto border-collapse border border-gray-400 my-4 w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 px-2 py-1">Item</th>
            <th className="border border-gray-400 px-2 py-1">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border px-2 py-1">Chair height</td><td className="border px-2 py-1">Feet flat, knees at 90°</td></tr>
          <tr><td className="border px-2 py-1">Monitor position</td><td className="border px-2 py-1">Eye level, arm’s length</td></tr>
          <tr><td className="border px-2 py-1">Keyboard/mouse</td><td className="border px-2 py-1">Elbows at 90°, wrists straight</td></tr>
          <tr><td className="border px-2 py-1">Lighting</td><td className="border px-2 py-1">No glare, adequate brightness</td></tr>
          <tr><td className="border px-2 py-1">Breaks</td><td className="border px-2 py-1">Taken every 2 hours</td></tr>
          <tr><td className="border px-2 py-1">Stretching</td><td className="border px-2 py-1">Daily routine followed</td></tr>
          <tr><td className="border px-2 py-1">Reporting</td><td className="border px-2 py-1">Knows how to report discomfort</td></tr>
        </tbody>
      </table>

      <p><strong>Scoring Guide:</strong></p>
      <ul className="list-disc ml-6">
        <li>30–35: Excellent</li>
        <li>20–29: Needs improvement</li>
        <li>Below 20: At risk – HR follow-up required</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">🎓 2. Certificate of Attendance Template</h2>
      <blockquote className="border-l-4 border-blue-400 pl-3 italic text-gray-700">
        This certifies that [Employee Name] has successfully completed the Workplace Ergonomics Training Program on [Date], in compliance with South Africa’s Ergonomics Regulations under the Occupational Health and Safety Act.
      </blockquote>
      <p className="mt-2"><strong>Signed by:</strong> HR Manager<br/>Astron Energy</p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">📊 3. PowerPoint Presentation Script</h2>
      <p><strong>Slide 1:</strong> Title — Workplace Ergonomics Training. “Protecting your health, wherever you work.”</p>
      <p><strong>Voiceover:</strong> Welcome to your ergonomic safety training...</p>
      <p><strong>Slide 2–8:</strong> Add bullet points from the markdown file — ergonomics definition, hazards, injuries, breaks, and compliance law.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">🎬 4. Animated Video Script (Remote Workers)</h2>
      <p>Short 3–4 min story: bad posture → discomfort → fix setup → report → certification earned. Use clear visuals and SA workplace context.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">🛠️ 5. HR Tracking & Reporting System</h2>
      <ul className="list-disc ml-6">
        <li>✅ Training completion log</li>
        <li>✅ Assessment score tracking</li>
        <li>✅ Certificate issuance log</li>
        <li>✅ Monthly compliance dashboard</li>
      </ul>

      <p className="mt-4">Suggested tools: Microsoft Forms (assessments), Power BI (tracking), SharePoint (records).</p>
    </div>
  );
}
