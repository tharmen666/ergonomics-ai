import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Resource = {
  id: string
  title: string
  url: string
  type: 'article'|'video'|'image'|'checklist'|'guide'
  lang: string
  source: string|null
  description: string|null
}

function Home() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('id,title,url,type,lang,source,description')
        .order('title', { ascending: true })
        .limit(50)
      if (!error && data) setResources(data)
      setLoading(false)
    })()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">OHS Haven – ErgoGuard™</h1>
      <p className="text-gray-700 mb-6">
        Training, self-assessment, and resources for office & remote ergonomics (SA compliant).
      </p>

      <div className="flex gap-3 mb-6">
        <a href="#/assess" className="px-4 py-2 rounded bg-black text-white">Start Assessment</a>
        <a href="#/kit" className="px-4 py-2 rounded bg-gray-200">Ergonomics Kit</a>
      </div>

      <h2 className="text-xl font-semibold mb-2">Featured Resources</h2>
      {loading ? <p>Loading…</p> : (
        <ul className="space-y-2">
          {resources.map(r => (
            <li key={r.id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.type} · {r.lang}{r.source ? ` · ${r.source}` : ''}</p>
                </div>
                <a className="text-blue-600 underline" href={r.url} target="_blank" rel="noreferrer">Open</a>
              </div>
              {r.description && <p className="text-sm mt-2">{r.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState(location.hash || '#/')

  useEffect(() => {
    const onHash = () => setRoute(location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.startsWith('#/assess')) return <Assessment />
  if (route.startsWith('#/kit')) return <ErgonomicsKit />

  return <Home />
}

/** --- Assessment page (10 Q, 90% pass, generates PDF certificate) --- **/
import jsPDF from 'jspdf'

function Assessment() {
  const questions = [
    { q: 'Chair height allows feet flat and knees ≈ 90°?', w: 1 },
    { q: 'Monitor is at eye level and about an arm’s length?', w: 1 },
    { q: 'Keyboard & mouse: elbows ≈ 90°, wrists straight?', w: 1 },
    { q: 'Lighting has minimal glare / adequate brightness?', w: 1 },
    { q: 'You take micro-breaks every 30–60 minutes?', w: 1 },
    { q: 'You stretch at least once per day?', w: 1 },
    { q: 'You know how to report discomfort early?', w: 1 },
    { q: 'Laptop users: you elevate screen + external KB/mouse?', w: 1 },
    { q: 'You alternate sitting/standing (or change posture)?', w: 1 },
    { q: 'Your space is quiet, well-lit, temp comfortable?', w: 1 },
  ] as const

  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0))
  const total = questions.reduce((a, b) => a + b.w, 0)
  const score = answers.reduce((sum, v, idx) => sum + (v ? questions[idx].w : 0), 0)
  const pct = Math.round((score / total) * 100)
  const passed = pct >= 90

  const setA = (i: number, val: number) => {
    const next = answers.slice()
    next[i] = val
    setAnswers(next)
  }

  const makeCert = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('OHS Haven – ErgoGuard™', 20, 20)
    doc.setFontSize(14)
    doc.text('Certificate of Completion', 20, 35)
    doc.setFontSize(11)
    doc.text(`This certifies that ${name || 'Employee'} has successfully completed`, 20, 50)
    doc.text('the Ergonomics Awareness & Compliance Module', 20, 58)
    doc.text(`Score: ${pct}% · Date: ${new Date().toLocaleDateString()}`, 20, 70)
    doc.text('Aligned to South Africa Ergonomics Regulations (OHS Act, 1993).', 20, 82)
    doc.text('Trainer: OHS Haven · HR: ____________________', 20, 98)
    doc.save(`ErgoGuard_Certificate_${(name || 'employee').replace(/\s+/g,'_')}.pdf`)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <a href="#/" className="text-blue-600 underline">&larr; Back</a>
      <h1 className="text-2xl font-bold mt-2 mb-4">Self-Assessment (Pass mark: 90%)</h1>

      <label className="block mb-4">
        <span className="text-sm text-gray-600">Your name (for the certificate)</span>
        <input value={name} onChange={e=>setName(e.target.value)} className="border rounded p-2 w-full" placeholder="Full name"/>
      </label>

      <ol className="space-y-3">
        {questions.map((item, i) => (
          <li key={i} className="border rounded p-3">
            <p className="font-medium mb-2">{i+1}. {item.q}</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <input type="radio" name={`q${i}`} onChange={()=>setA(i,1)} /> Yes
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name={`q${i}`} onChange={()=>setA(i,0)} /> No
              </label>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 p-3 bg-gray-100 rounded">
        <p className="font-semibold">Score: {pct}% {passed ? '✅ Passed' : '❗Needs 90%+'}</p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          disabled={!passed}
          onClick={makeCert}
          className={`px-4 py-2 rounded text-white ${passed ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Download Certificate (PDF)
        </button>
        <a href="#/kit" className="px-4 py-2 rounded bg-gray-200">Open Ergonomics Kit</a>
      </div>
    </div>
  )
}

/** --- Simple ergonomics kit page (you already have a version, this is a safe default) --- **/
function ErgonomicsKit() {
  const vids = [
    {title:'360° HEALTH – Ergonomics & Wellness', url:'https://www.youtube.com/watch?v=g8okeqaQHsU'},
    {title:'Optimize Your Ergonomics for Remote Work', url:'https://www.youtube.com/watch?v=MSU1-16ztHo'},
    {title:'Ergonomics for Your Workspace', url:'https://www.youtube.com/watch?v=nIQECMXsGdM'},
    {title:'Ergonomic tips – Kate Ayoub, PT', url:'https://www.youtube.com/watch?v=7YDeeb5SGkc'},
  ]
  const links = [
    {title:'Upwork – Home Office Ergonomics Tips', url:'https://www.upwork.com/resources/home-office-ergonomics-tips'},
    {title:'Public Health Degrees – WFH Setup', url:'https://www.publichealthdegrees.org/resources/how-to-create-work-from-home-set-up/'},
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <a href="#/" className="text-blue-600 underline">&larr; Back</a>
      <h1 className="text-2xl font-bold mt-2 mb-4">Ergonomics Kit</h1>

      <h2 className="text-xl font-semibold mt-4 mb-2">Videos</h2>
      <ul className="list-disc ml-6">
        {vids.map(v => (
          <li key={v.url}><a className="text-blue-700 underline" href={v.url} target="_blank" rel="noreferrer">{v.title}</a></li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Guides</h2>
      <ul className="list-disc ml-6">
        {links.map(v => (
          <li key={v.url}><a className="text-blue-700 underline" href={v.url} target="_blank" rel="noreferrer">{v.title}</a></li>
        ))}
      </ul>
    </div>
  )
}
