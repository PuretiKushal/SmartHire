
// SmartHire — AI Recruitment Platform
// Real resume parsing (PDF via pdf.js, DOCX via mammoth),
// multi-candidate AI scoring via Anthropic API, CSV/XLSX export.

import { useState, useCallback, useRef, useEffect } from "react";
import * as mammoth from "mammoth";

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const T = {
  bg:          "#07090F",
  surface:     "#0C0F1A",
  surfaceHi:   "#111624",
  surfaceHi2:  "#161C2E",
  border:      "#1A2238",
  borderHi:    "#243050",
  accent:      "#4F8EF7",
  accentHover: "#6BA3FF",
  emerald:     "#10B981",
  amber:       "#F59E0B",
  rose:        "#F43F5E",
  violet:      "#8B5CF6",
  text:        "#E8EDF5",
  textSub:     "#8899BB",
  textMuted:   "#475569",
  mono:        "'IBM Plex Mono', monospace",
  sans:        "'Sora', sans-serif",
  serif:       "'Playfair Display', serif",
};

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;overflow:hidden}
body{background:${T.bg};color:${T.text};font-family:${T.sans};-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:${T.bg}}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
input,textarea,select{font-family:${T.sans}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}
@keyframes ringFill{from{stroke-dashoffset:var(--circ)}to{stroke-dashoffset:var(--offset)}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.fu{animation:fadeUp .45s ease both}
.fi{animation:fadeIn .3s ease both}
.si{animation:slideIn .35s ease both}
`;

/* ─── Tiny helpers ───────────────────────────────────────────────────────── */
const clr = (score) => score >= 80 ? T.emerald : score >= 60 ? T.amber : score >= 40 ? "#F97316" : T.rose;

function scoreLabel(s){ return s>=80?"Excellent":s>=60?"Good":s>=40?"Fair":"Poor" }

function fmtSize(b){ return b>1e6?`${(b/1e6).toFixed(1)} MB`:`${(b/1024).toFixed(0)} KB` }

/* ─── Reusable UI atoms ──────────────────────────────────────────────────── */

const Spinner = ({size=18,color=T.accent}) => (
  <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",
    border:`2px solid ${color}30`,borderTopColor:color,
    animation:"spin .75s linear infinite",flexShrink:0}}/>
);

const Badge = ({children,color=T.accent,dot})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:5,
    padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,
    letterSpacing:".04em",textTransform:"uppercase",
    background:`${color}18`,color,border:`1px solid ${color}28`,
    fontFamily:T.mono,whiteSpace:"nowrap"}}>
    {dot&&<span style={{width:6,height:6,borderRadius:"50%",background:color,display:"inline-block"}}/>}
    {children}
  </span>
);

function Btn({children,onClick,variant="primary",disabled,small,icon,style:sx}){
  const [h,setH]=useState(false);
  const base={
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,
    padding:small?"8px 16px":"11px 22px",
    borderRadius:10,fontSize:small?12:13,fontWeight:600,
    cursor:disabled?"not-allowed":"pointer",
    transition:"all .18s ease",border:"none",outline:"none",
    opacity:disabled?.5:1,fontFamily:T.sans,letterSpacing:".01em",...sx
  };
  const v={
    primary:{background:h?"#5F9EFF":T.accent,color:"#fff",
      boxShadow:h?"0 0 24px rgba(79,142,247,.45)":"none"},
    secondary:{background:h?T.surfaceHi2:"transparent",color:T.text,
      border:`1px solid ${T.border}`},
    ghost:{background:h?T.surfaceHi:"transparent",color:T.textSub},
    danger:{background:h?"#E11D48":T.rose,color:"#fff"},
    success:{background:h?"#059669":T.emerald,color:"#fff"},
    amber:{background:h?"#D97706":T.amber,color:"#000"},
  };
  return(
    <button style={{...base,...v[variant]}} onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      {icon&&<span style={{fontSize:14}}>{icon}</span>}{children}
    </button>
  );
}

function Card({children,style:sx,onClick,hover=true}){
  const [h,setH]=useState(false);
  return(
    <div onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:T.surface,border:`1px solid ${h&&hover&&onClick?T.borderHi:T.border}`,
        borderRadius:16,transition:"all .18s ease",
        cursor:onClick?"pointer":"default",
        transform:h&&hover&&onClick?"translateY(-2px)":"none",
        boxShadow:h&&hover&&onClick?"0 8px 32px rgba(0,0,0,.4)":"none",...sx}}>
      {children}
    </div>
  );
}

function Input({label,value,onChange,placeholder,required,multiline,rows=4,style:sx}){
  const [f,setF]=useState(false);
  const shared={width:"100%",padding:"11px 14px",
    background:T.surfaceHi,border:`1px solid ${f?T.accent:T.border}`,
    borderRadius:10,color:T.text,fontSize:13,fontFamily:T.sans,
    outline:"none",transition:"border-color .18s",lineHeight:1.6,...sx};
  return(
    <div>
      {label&&<label style={{display:"block",fontSize:12,fontWeight:600,
        color:T.textSub,marginBottom:7,letterSpacing:".04em",textTransform:"uppercase"}}>
        {label}{required&&<span style={{color:T.accent,marginLeft:4}}>*</span>}
      </label>}
      {multiline
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
            placeholder={placeholder} style={{...shared,resize:"vertical"}}
            onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
        :<input value={value} onChange={e=>onChange(e.target.value)}
            placeholder={placeholder} style={shared}
            onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
      }
    </div>
  );
}

function ScoreRing({score,size=80}){
  const r=size/2-7, circ=2*Math.PI*r;
  const offset=circ-(score/100)*circ;
  const c=clr(score);
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${c}22`} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={6}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:size*.22,fontWeight:700,color:c,fontFamily:T.mono,lineHeight:1}}>{score}</span>
        <span style={{fontSize:size*.1,color:T.textMuted,fontFamily:T.mono}}>%</span>
      </div>
    </div>
  );
}

function ProgressBar({pct,color=T.accent,label,sub}){
  return(
    <div>
      {(label||sub!=null)&&(
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
          {label&&<span style={{fontSize:12,color:T.textSub}}>{label}</span>}
          {sub!=null&&<span style={{fontSize:12,fontFamily:T.mono,color,fontWeight:600}}>{sub}%</span>}
        </div>
      )}
      <div style={{height:6,background:`${color}18`,borderRadius:3,overflow:"hidden"}}>
        <div style={{"--w":`${pct}%`,width:`${pct}%`,height:"100%",
          background:`linear-gradient(90deg,${color}cc,${color})`,borderRadius:3,
          boxShadow:`0 0 10px ${color}60`,
          animation:"barGrow 1s cubic-bezier(.4,0,.2,1) both"}}/>
      </div>
    </div>
  );
}

/* ─── PDF text extraction via pdf.js CDN ────────────────────────────────── */
async function extractPDF(file){
  // Dynamically load pdf.js from CDN
  if(!window.pdfjsLib){
    await new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc=
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const buf=await file.arrayBuffer();
  const pdf=await window.pdfjsLib.getDocument({data:buf}).promise;
  let text="";
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i);
    const content=await page.getTextContent();
    text+=content.items.map(it=>it.str).join(" ")+"\n";
  }
  return text;
}

/* ─── DOCX text extraction via mammoth ──────────────────────────────────── */
async function extractDOCX(file){
  const buf=await file.arrayBuffer();
  const result=await mammoth.extractRawText({arrayBuffer:buf});
  return result.value;
}

/* ─── Master text extractor ─────────────────────────────────────────────── */
async function extractText(file){
  const name=file.name.toLowerCase();
  if(name.endsWith(".pdf")) return extractPDF(file);
  if(name.endsWith(".docx")||name.endsWith(".doc")) return extractDOCX(file);
  throw new Error("Unsupported format");
}

/* ─── Anthropic API call ─────────────────────────────────────────────────── */
async function callClaude(prompt,max_tokens=1500){
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens,
      messages:[{role:"user",content:prompt}]
    })
  });
  if(!res.ok) throw new Error(`API error ${res.status}`);
  const d=await res.json();
  return d.content.map(b=>b.text||"").join("");
}

/* ─── AI: parse + score a single resume ─────────────────────────────────── */
async function analyzeResume(resumeText, jobTitle, jobDescription, jobSkills, jobExperience, jobEducation){
  const prompt=`You are an expert HR AI. Analyze this resume against the job requirements and return ONLY valid JSON (no markdown, no explanation).

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
REQUIRED SKILLS: ${jobSkills}
EXPERIENCE REQUIREMENT: ${jobExperience}
EDUCATION REQUIREMENT: ${jobEducation}

RESUME TEXT:
${resumeText.slice(0,4000)}

Return this exact JSON structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1 234 567 8900",
  "title": "Their current/most recent job title",
  "yearsExperience": 5,
  "skills": ["skill1","skill2"],
  "matchedSkills": ["skills that match job requirements"],
  "missingSkills": ["required skills they lack"],
  "education": "Degree — Institution",
  "certifications": ["cert1"],
  "projects": ["project description"],
  "workHistory": ["Company (years): brief role description"],
  "summary": "2-3 sentence AI summary of this candidate's fit for the role",
  "redFlags": ["any concerns like short tenures, gaps, missing critical skills"],
  "gapAnalysis": "1-2 sentence analysis of skill gaps and upskilling potential",
  "matchScore": 85,
  "scoreBreakdown": {
    "skills": 40,
    "experience": 25,
    "education": 15,
    "projects": 10,
    "certifications": 10
  },
  "interviewQuestions": ["Q1","Q2","Q3"]
}

matchScore should be 0-100 based on how well the candidate fits the role.
scoreBreakdown values should each be 0-100.`;

  const raw=await callClaude(prompt,1800);
  const clean=raw.replace(/```json|```/g,"").trim();
  // extract first JSON object
  const m=clean.match(/\{[\s\S]*\}/);
  if(!m) throw new Error("No JSON in response");
  return JSON.parse(m[0]);
}

/* ─── CSV / Excel export ─────────────────────────────────────────────────── */
function exportCSV(candidates){
  const headers=["Rank","Name","Email","Phone","Match Score","Score Label","Skills","Experience (yrs)","Education","Red Flags"];
  const rows=candidates.map((c,i)=>[
    i+1, c.name, c.email, c.phone, c.matchScore, scoreLabel(c.matchScore),
    `"${(c.skills||[]).join("; ")}"`, c.yearsExperience,
    `"${c.education||""}"`, `"${(c.redFlags||[]).join("; ")}"`
  ]);
  const csv=[headers,...rows].map(r=>r.join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="SmartHire_Rankings.csv"; a.click();
  URL.revokeObjectURL(url);
}

function exportExcel(candidates){
  // Build a minimal XLSX using SheetJS
  import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs").then(XLSX=>{
    const data=[
      ["Rank","Name","Email","Phone","Match Score","Score Label","Skills","Experience (yrs)","Education","Matched Skills","Missing Skills","Red Flags"],
      ...candidates.map((c,i)=>[
        i+1, c.name||"", c.email||"", c.phone||"",
        c.matchScore, scoreLabel(c.matchScore),
        (c.skills||[]).join(", "), c.yearsExperience||0,
        c.education||"", (c.matchedSkills||[]).join(", "),
        (c.missingSkills||[]).join(", "), (c.redFlags||[]).join(", ")
      ])
    ];
    const ws=XLSX.utils.aoa_to_sheet(data);
    ws["!cols"]=[{wch:6},{wch:22},{wch:28},{wch:16},{wch:12},{wch:12},{wch:45},{wch:14},{wch:35},{wch:35},{wch:30},{wch:35}];
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Rankings");
    XLSX.writeFile(wb,"SmartHire_Rankings.xlsx");
  }).catch(()=>exportCSV(candidates)); // fallback to CSV
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE: SIDEBAR
════════════════════════════════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",icon:"⊞",label:"Dashboard"},
  {id:"job",icon:"✦",label:"Job Setup"},
  {id:"upload",icon:"↑",label:"Upload Resumes"},
  {id:"rankings",icon:"≡",label:"Rankings"},
];

function Sidebar({page,setPage,job,counts}){
  return(
    <aside style={{width:220,background:T.surface,borderRight:`1px solid ${T.border}`,
      display:"flex",flexDirection:"column",flexShrink:0,zIndex:20}}>

      {/* Logo */}
      <div style={{padding:"26px 22px 20px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:36,height:36,borderRadius:11,flexShrink:0,
            background:"linear-gradient(135deg,#4F8EF7,#8B5CF6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:17,fontWeight:900,color:"#fff",letterSpacing:"-1px"}}>S</div>
          <div>
            <div style={{fontSize:16,fontWeight:800,letterSpacing:"-.02em"}}>SmartHire</div>
            <div style={{fontSize:10,color:T.textMuted,letterSpacing:".1em",textTransform:"uppercase"}}>AI Recruitment</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{padding:"14px 12px",flex:1}}>
        {job.title&&(
          <div style={{margin:"0 4px 16px",padding:"12px 14px",borderRadius:10,
            background:`${T.accent}12`,border:`1px solid ${T.accent}20`}}>
            <div style={{fontSize:10,color:T.accent,fontWeight:600,letterSpacing:".08em",
              textTransform:"uppercase",marginBottom:4}}>Active Job</div>
            <div style={{fontSize:12,fontWeight:600,color:T.text,lineHeight:1.4}}>{job.title}</div>
          </div>
        )}
        {NAV.map(n=>{
          const active=page===n.id;
          const cnt = n.id==="rankings"?counts.candidates:null;
          return(
            <div key={n.id} onClick={()=>setPage(n.id)} style={{
              display:"flex",alignItems:"center",gap:11,
              padding:"10px 14px",borderRadius:10,marginBottom:3,
              cursor:"pointer",userSelect:"none",
              background:active?`${T.accent}18`:"transparent",
              color:active?T.accent:T.textSub,
              fontSize:13,fontWeight:active?600:400,
              transition:"all .15s",
            }}>
              <span style={{fontSize:15,width:18,textAlign:"center"}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {active&&<div style={{width:5,height:5,borderRadius:"50%",background:T.accent}}/>}
              {cnt>0&&!active&&(
                <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,
                  background:`${T.emerald}20`,color:T.emerald,fontFamily:T.mono}}>{cnt}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{padding:16,borderTop:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:"50%",
            background:"linear-gradient(135deg,#6366F1,#8B5CF6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>R</div>
          <div>
            <div style={{fontSize:12,fontWeight:600}}>Recruiter</div>
            <div style={{fontSize:11,color:T.textMuted}}>Admin · Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE: DASHBOARD
════════════════════════════════════════════════════════════════════════════ */
function DashboardPage({job,candidates,setPage}){
  const avg=candidates.length?Math.round(candidates.reduce((a,c)=>a+c.matchScore,0)/candidates.length):0;
  const top=[...candidates].sort((a,b)=>b.matchScore-a.matchScore).slice(0,5);

  const stats=[
    {label:"Active Jobs",val:job.title?1:0,color:T.accent,icon:"✦"},
    {label:"Candidates",val:candidates.length,color:T.violet,icon:"👤"},
    {label:"Avg Match",val:avg?`${avg}%`:"—",color:T.emerald,icon:"◎"},
    {label:"Top Tier (≥80%)",val:candidates.filter(c=>c.matchScore>=80).length,color:T.amber,icon:"★"},
  ];

  return(
    <div style={{flex:1,overflowY:"auto",padding:"36px 40px"}} className="fu">
      <div style={{marginBottom:32}}>
        <h1 style={{fontFamily:T.serif,fontSize:30,fontWeight:700,marginBottom:6}}>Recruitment Dashboard</h1>
        <p style={{color:T.textSub,fontSize:13}}>AI-powered candidate screening overview</p>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
        {stats.map(s=>(
          <Card key={s.label} style={{padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,color:T.textMuted,fontWeight:600,letterSpacing:".06em",
                  textTransform:"uppercase",marginBottom:10}}>{s.label}</div>
                <div style={{fontSize:34,fontWeight:800,color:s.color,fontFamily:T.mono}}>{s.val}</div>
              </div>
              <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,
                color:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20}}>
        {/* Leaderboard */}
        <Card style={{padding:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h3 style={{fontSize:15,fontWeight:700}}>Top Candidates</h3>
            <Btn variant="ghost" small onClick={()=>setPage("rankings")}>View all →</Btn>
          </div>
          {top.length===0&&(
            <div style={{textAlign:"center",padding:"32px 0",color:T.textMuted,fontSize:13}}>
              No candidates yet. Upload resumes to start.
            </div>
          )}
          {top.map((c,i)=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:14,
              padding:"13px 0",borderBottom:i<top.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{width:28,fontSize:14,textAlign:"center",color:T.textMuted,fontFamily:T.mono,fontWeight:600}}>
                {["🥇","🥈","🥉"][i]||`#${i+1}`}
              </div>
              <div style={{width:38,height:38,borderRadius:"50%",flexShrink:0,
                background:`linear-gradient(135deg,${T.accent},${T.violet})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:14,fontWeight:700,color:"#fff"}}>{c.name?.charAt(0)||"?"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{c.name}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{c.title}</div>
              </div>
              <ScoreRing score={c.matchScore} size={46}/>
            </div>
          ))}
        </Card>

        {/* Score distribution */}
        <Card style={{padding:28}}>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:24}}>Score Distribution</h3>
          {[
            {label:"Excellent ≥ 80%",min:80,max:101,color:T.emerald},
            {label:"Good 60–79%",min:60,max:80,color:T.amber},
            {label:"Fair 40–59%",min:40,max:60,color:"#F97316"},
            {label:"Poor < 40%",min:0,max:40,color:T.rose},
          ].map(tier=>{
            const cnt=candidates.filter(c=>c.matchScore>=tier.min&&c.matchScore<tier.max).length;
            const pct=candidates.length?Math.round((cnt/candidates.length)*100):0;
            return(
              <div key={tier.label} style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontSize:12,color:T.textSub}}>{tier.label}</span>
                  <span style={{fontSize:12,fontFamily:T.mono,color:tier.color,fontWeight:600}}>{cnt}</span>
                </div>
                <ProgressBar pct={pct} color={tier.color}/>
              </div>
            );
          })}

          {!job.title&&(
            <div style={{marginTop:24,padding:14,borderRadius:10,
              background:`${T.accent}10`,border:`1px solid ${T.accent}20`,textAlign:"center"}}>
              <div style={{fontSize:12,color:T.accent,marginBottom:8}}>No job configured</div>
              <Btn small variant="secondary" onClick={()=>setPage("job")}>Setup Job →</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE: JOB SETUP
════════════════════════════════════════════════════════════════════════════ */
function JobPage({job,setJob,setPage}){
  const [f,setF]=useState(job.title?job:{title:"",description:"",skills:"",experience:"",education:"",preferences:""});
  const [saved,setSaved]=useState(false);

  const save=()=>{
    if(!f.title||!f.description) return;
    setJob(f); setSaved(true);
    setTimeout(()=>{setSaved(false);setPage("upload");},1000);
  };

  const loadExample=()=>setF({
    title:"Senior Full-Stack Engineer",
    description:"We are building next-gen developer tooling and need a seasoned engineer to join our core product team. You'll architect and ship features used by thousands of developers daily, work across the full stack, and mentor junior engineers.",
    skills:"React, TypeScript, Node.js, PostgreSQL, AWS, Docker, GraphQL, REST APIs",
    experience:"5+ years professional software engineering",
    education:"Bachelor's degree in Computer Science or equivalent",
    preferences:"Open source contributions, startup experience, distributed systems",
  });

  return(
    <div style={{flex:1,overflowY:"auto",padding:"36px 40px"}} className="fu">
      <div style={{maxWidth:720}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
          <div>
            <h1 style={{fontFamily:T.serif,fontSize:30,fontWeight:700,marginBottom:6}}>Job Setup</h1>
            <p style={{color:T.textSub,fontSize:13}}>Define the role so AI can match candidates accurately</p>
          </div>
          <Btn variant="secondary" small onClick={loadExample} icon="✦">Load Example</Btn>
        </div>

        <Card style={{padding:36}}>
          <div style={{display:"grid",gap:22}}>
            <Input label="Job Title" value={f.title} onChange={v=>setF(x=>({...x,title:v}))}
              placeholder="e.g. Senior Full-Stack Engineer" required/>
            <Input label="Job Description" value={f.description} onChange={v=>setF(x=>({...x,description:v}))}
              placeholder="Describe the role, responsibilities, and success criteria..." multiline rows={5} required/>
            <Input label="Required Skills" value={f.skills} onChange={v=>setF(x=>({...x,skills:v}))}
              placeholder="React, TypeScript, Node.js, AWS, PostgreSQL..." required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
              <Input label="Experience Requirements" value={f.experience} onChange={v=>setF(x=>({...x,experience:v}))}
                placeholder="5+ years professional experience" required/>
              <Input label="Education Requirements" value={f.education} onChange={v=>setF(x=>({...x,education:v}))}
                placeholder="Bachelor's in CS or equivalent"/>
            </div>
            <Input label="Preferred Qualifications (Optional)" value={f.preferences}
              onChange={v=>setF(x=>({...x,preferences:v}))}
              placeholder="Open source contributions, startup experience..."/>
          </div>

          <div style={{display:"flex",gap:12,marginTop:32,paddingTop:24,borderTop:`1px solid ${T.border}`}}>
            <Btn onClick={save} disabled={!f.title||!f.description}>
              {saved?"✓ Saved!":"Save & Continue →"}
            </Btn>
            <Btn variant="secondary" onClick={()=>setF({title:"",description:"",skills:"",experience:"",education:"",preferences:""})}>
              Clear
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE: UPLOAD + PROCESS
════════════════════════════════════════════════════════════════════════════ */
function UploadPage({job,candidates,setCandidates}){
  const [queue,setQueue]=useState([]); // {file, status, error, result}
  const [dragging,setDragging]=useState(false);
  const [processing,setProcessing]=useState(false);
  const inputRef=useRef();

  const addFiles=useCallback((fileList)=>{
    const valid=Array.from(fileList).filter(f=>f.name.match(/\.(pdf|docx|doc)$/i));
    const invalid=Array.from(fileList).filter(f=>!f.name.match(/\.(pdf|docx|doc)$/i));
    if(invalid.length) alert(`Unsupported: ${invalid.map(f=>f.name).join(", ")}\n\nOnly PDF and DOCX accepted.`);
    setQueue(q=>[...q,...valid.map(f=>({id:Math.random().toString(36).slice(2),file:f,status:"queued",error:null,result:null}))]);
  },[]);

  const onDrop=useCallback(e=>{
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  },[addFiles]);

  const processAll=async()=>{
    if(!job.title){alert("Please set up a job first!");return;}
    const pending=queue.filter(q=>q.status==="queued");
    if(!pending.length) return;
    setProcessing(true);

    for(const item of pending){
      // mark as extracting
      setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"extracting"}:x));
      let text="";
      try{
        text=await extractText(item.file);
      }catch(e){
        setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"error",error:"Could not read file: "+e.message}:x));
        continue;
      }

      // mark as analyzing
      setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"analyzing"}:x));
      try{
        const result=await analyzeResume(text,job.title,job.description,job.skills,job.experience,job.education);
        result.id=item.id;
        result.fileName=item.file.name;
        setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"done",result}:x));
        setCandidates(prev=>{
          const filtered=prev.filter(c=>c.id!==item.id);
          return [...filtered,result];
        });
      }catch(e){
        setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"error",error:"AI error: "+e.message}:x));
      }
    }
    setProcessing(false);
  };

  const remove=id=>setQueue(q=>q.filter(x=>x.id!==id));
  const clearDone=()=>setQueue(q=>q.filter(x=>x.status==="queued"));

  const pending=queue.filter(q=>q.status==="queued");
  const done=queue.filter(q=>q.status==="done");
  const errors=queue.filter(q=>q.status==="error");
  const inFlight=queue.filter(q=>q.status==="extracting"||q.status==="analyzing");

  const statusIcon={queued:"○",extracting:"📄",analyzing:"🧠",done:"✓",error:"✗"};
  const statusColor={queued:T.textMuted,extracting:T.amber,analyzing:T.accent,done:T.emerald,error:T.rose};

  return(
    <div style={{flex:1,overflowY:"auto",padding:"36px 40px"}} className="fu">
      <div style={{maxWidth:780}}>
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:T.serif,fontSize:30,fontWeight:700,marginBottom:6}}>Upload Resumes</h1>
          <p style={{color:T.textSub,fontSize:13}}>
            {job.title
              ?<>Analyzing for: <span style={{color:T.accent,fontWeight:600}}>{job.title}</span></>
              :<span style={{color:T.rose}}>⚠ No job configured — set up a job first</span>
            }
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e=>{e.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={onDrop}
          onClick={()=>!processing&&inputRef.current?.click()}
          style={{border:`2px dashed ${dragging?T.accent:T.border}`,borderRadius:16,
            padding:"52px 40px",textAlign:"center",
            cursor:processing?"default":"pointer",
            background:dragging?`${T.accent}08`:T.surface,
            transition:"all .2s",marginBottom:24,
            boxShadow:dragging?`0 0 40px ${T.accent}25`:"none"}}>
          <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.doc"
            onChange={e=>addFiles(e.target.files)} style={{display:"none"}}/>
          <div style={{fontSize:44,marginBottom:14}}>📂</div>
          <div style={{fontSize:17,fontWeight:600,marginBottom:8}}>
            {dragging?"Drop to add resumes":"Drag & drop resumes here"}
          </div>
          <div style={{color:T.textMuted,fontSize:13,marginBottom:20}}>
            PDF and DOCX supported · Multiple files at once
          </div>
          <Btn variant="secondary" small
            onClick={e=>{e.stopPropagation();inputRef.current?.click()}} icon="↑">
            Browse Files
          </Btn>
        </div>

        {/* Queue */}
        {queue.length>0&&(
          <Card style={{padding:24,marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h3 style={{fontSize:14,fontWeight:700}}>
                {queue.length} resume{queue.length!==1?"s":""} · {done.length} done
                {errors.length>0&&<span style={{color:T.rose,marginLeft:8}}> · {errors.length} failed</span>}
              </h3>
              <div style={{display:"flex",gap:8}}>
                {done.length>0&&<Btn variant="ghost" small onClick={clearDone}>Clear done</Btn>}
                {pending.length>0&&!processing&&<Btn small onClick={processAll} disabled={!job.title} icon="🧠">
                  Analyze {pending.length} Resume{pending.length!==1?"s":""}
                </Btn>}
              </div>
            </div>

            <div style={{display:"grid",gap:9}}>
              {queue.map(item=>(
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:13,
                  padding:"12px 16px",borderRadius:10,
                  background:T.surfaceHi,border:`1px solid ${
                    item.status==="done"?`${T.emerald}30`:
                    item.status==="error"?`${T.rose}30`:T.border}`}}>
                  {(item.status==="extracting"||item.status==="analyzing")
                    ?<Spinner size={16} color={statusColor[item.status]}/>
                    :<span style={{fontSize:14,color:statusColor[item.status],fontWeight:700,width:16,textAlign:"center"}}>
                      {statusIcon[item.status]}
                    </span>
                  }
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {item.file.name}
                    </div>
                    <div style={{fontSize:11,color:T.textMuted,marginTop:1}}>
                      {fmtSize(item.file.size)} · {" "}
                      {item.status==="extracting"&&<span style={{color:T.amber}}>Extracting text…</span>}
                      {item.status==="analyzing"&&<span style={{color:T.accent}}>AI analyzing…</span>}
                      {item.status==="queued"&&<span>Queued</span>}
                      {item.status==="done"&&<span style={{color:T.emerald}}>✓ {item.result?.name||"Processed"} — {item.result?.matchScore}% match</span>}
                      {item.status==="error"&&<span style={{color:T.rose}}>{item.error}</span>}
                    </div>
                  </div>
                  {item.status==="queued"&&(
                    <button onClick={()=>remove(item.id)} style={{background:"none",border:"none",
                      color:T.textMuted,cursor:"pointer",fontSize:16,padding:"0 4px"}}>×</button>
                  )}
                </div>
              ))}
            </div>

            {/* Global progress */}
            {processing&&(
              <div style={{marginTop:18}}>
                <ProgressBar
                  pct={Math.round((done.length/(queue.length-errors.length||1))*100)}
                  color={T.accent}
                  label={`Processing… (${done.length+errors.length}/${queue.length})`}
                  sub={Math.round(((done.length+errors.length)/queue.length)*100)}
                />
              </div>
            )}
          </Card>
        )}

        {/* Tips */}
        {queue.length===0&&(
          <Card style={{padding:24}}>
            <div style={{fontSize:12,fontWeight:700,color:T.textSub,letterSpacing:".08em",
              textTransform:"uppercase",marginBottom:16}}>How It Works</div>
            {[
              {icon:"📤",label:"Upload",desc:"Drag in any PDF or DOCX resumes"},
              {icon:"🧠",label:"AI Extraction",desc:"Text is extracted and parsed by AI"},
              {icon:"📊",label:"Scoring",desc:"Candidates are scored against the job description"},
              {icon:"🏆",label:"Rankings",desc:"View ranked results with detailed analysis"},
            ].map((s,i)=>(
              <div key={s.label} style={{display:"flex",gap:14,padding:"12px 0",
                borderBottom:i<3?`1px solid ${T.border}`:"none",alignItems:"flex-start"}}>
                <span style={{fontSize:20}}>{s.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{s.label}</div>
                  <div style={{fontSize:12,color:T.textMuted}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE: RANKINGS
════════════════════════════════════════════════════════════════════════════ */
function RankingsPage({candidates,job,onSelect}){
  const [sort,setSort]=useState("score");
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [showExport,setShowExport]=useState(false);

  const sorted=[...candidates].sort((a,b)=>
    sort==="score"?b.matchScore-a.matchScore:
    sort==="exp"?b.yearsExperience-a.yearsExperience:
    (a.name||"").localeCompare(b.name||"")
  ).filter(c=>
    (filter==="all")||(filter==="excellent"&&c.matchScore>=80)||
    (filter==="good"&&c.matchScore>=60&&c.matchScore<80)||
    (filter==="fair"&&c.matchScore<60)
  ).filter(c=>
    !search||
    (c.name||"").toLowerCase().includes(search.toLowerCase())||
    (c.skills||[]).some(s=>s.toLowerCase().includes(search.toLowerCase()))
  );

  return(
    <div style={{flex:1,overflowY:"auto",padding:"36px 40px"}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:16}}>
        <div>
          <h1 style={{fontFamily:T.serif,fontSize:30,fontWeight:700,marginBottom:6}}>Candidate Rankings</h1>
          <p style={{color:T.textSub,fontSize:13}}>
            {job.title?<>For: <span style={{color:T.accent}}>{job.title}</span> · </>:""}
            {sorted.length} of {candidates.length} shown
          </p>
        </div>
        <div style={{display:"flex",gap:10,position:"relative"}}>
          <Btn variant="secondary" small icon="↓" onClick={()=>setShowExport(x=>!x)}>Export</Btn>
          {showExport&&(
            <div style={{position:"absolute",top:"110%",right:0,background:T.surfaceHi,
              border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",zIndex:50,minWidth:160}}>
              <button onClick={()=>{exportCSV(sorted);setShowExport(false);}}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 18px",
                  background:"none",border:"none",color:T.text,cursor:"pointer",fontSize:13,
                  fontFamily:T.sans,textAlign:"left"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHi2}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                📄 Download CSV
              </button>
              <button onClick={()=>{exportExcel(sorted);setShowExport(false);}}
                style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 18px",
                  background:"none",border:"none",color:T.text,cursor:"pointer",fontSize:13,
                  fontFamily:T.sans,textAlign:"left"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.surfaceHi2}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                📊 Download Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:1,minWidth:200}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search name or skill…"
            style={{width:"100%",padding:"10px 14px",background:T.surface,
              border:`1px solid ${T.border}`,borderRadius:10,color:T.text,
              fontSize:13,fontFamily:T.sans,outline:"none"}}/>
        </div>
        <div style={{display:"flex",gap:7}}>
          {["all","excellent","good","fair"].map(fv=>(
            <button key={fv} onClick={()=>setFilter(fv)} style={{
              padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:600,
              cursor:"pointer",transition:"all .15s",
              background:filter===fv?T.accent:"transparent",
              color:filter===fv?"#fff":T.textSub,
              border:`1px solid ${filter===fv?T.accent:T.border}`,
              fontFamily:T.sans,textTransform:"capitalize"}}>
              {fv}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{padding:"10px 14px",background:T.surface,border:`1px solid ${T.border}`,
            borderRadius:10,color:T.text,fontSize:13,outline:"none",cursor:"pointer",fontFamily:T.sans}}>
          <option value="score">Sort: Match Score</option>
          <option value="exp">Sort: Experience</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
      </div>

      {/* Cards */}
      {candidates.length===0&&(
        <div style={{textAlign:"center",padding:"72px 0",color:T.textMuted}}>
          <div style={{fontSize:52,marginBottom:16}}>📭</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:8}}>No candidates yet</div>
          <div style={{fontSize:13,marginBottom:24}}>Upload resumes and run AI analysis to populate rankings</div>
        </div>
      )}

      <div style={{display:"grid",gap:12}}>
        {sorted.map((c,i)=>{
          const globalRank=candidates.indexOf(c)+1; // rank in full list by score
          const rank=[...candidates].sort((a,b)=>b.matchScore-a.matchScore).indexOf(c)+1;
          const col=clr(c.matchScore);
          return(
            <Card key={c.id} glow onClick={()=>onSelect(c)} style={{overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"stretch"}}>
                {/* Rank stripe */}
                <div style={{width:58,flexShrink:0,
                  background:rank<=3?`${["#F0B429","#94A3B8","#CD7F32"][rank-1]}12`:`${T.surfaceHi}`,
                  borderRight:`1px solid ${T.border}`,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  fontSize:rank<=3?22:14,
                  color:rank<=3?["#F0B429","#94A3B8","#CD7F32"][rank-1]:T.textMuted,
                  fontWeight:700,fontFamily:T.mono}}>
                  {["🥇","🥈","🥉"][rank-1]||`#${rank}`}
                </div>

                <div style={{flex:1,padding:"20px 24px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
                  {/* Avatar */}
                  <div style={{width:50,height:50,borderRadius:"50%",flexShrink:0,
                    background:`linear-gradient(135deg,${T.accent},${T.violet})`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:19,fontWeight:800,color:"#fff"}}>
                    {c.name?.charAt(0)||"?"}
                  </div>

                  {/* Info */}
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap",marginBottom:5}}>
                      <span style={{fontSize:16,fontWeight:700}}>{c.name||"Unknown"}</span>
                      {(c.redFlags||[]).length===0
                        ?<Badge color={T.emerald} dot>Clean</Badge>
                        :<Badge color={T.rose} dot>{c.redFlags.length} flag{c.redFlags.length>1?"s":""}</Badge>
                      }
                    </div>
                    <div style={{fontSize:12,color:T.textMuted,marginBottom:10}}>
                      {c.title||"—"} · {c.yearsExperience||0}y exp
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {(c.skills||[]).slice(0,5).map(s=>(
                        <span key={s} style={{padding:"3px 9px",borderRadius:5,fontSize:11,fontWeight:500,
                          background:`${T.accent}14`,color:T.accent,border:`1px solid ${T.accent}22`}}>{s}</span>
                      ))}
                      {(c.skills||[]).length>5&&(
                        <span style={{fontSize:11,color:T.textMuted,padding:"3px 6px"}}>
                          +{(c.skills||[]).length-5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                    <ScoreRing score={c.matchScore} size={74}/>
                    <Badge color={col}>{scoreLabel(c.matchScore)}</Badge>
                  </div>

                  <span style={{color:T.textMuted,fontSize:20}}>›</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sorted.length===0&&candidates.length>0&&(
        <div style={{textAlign:"center",padding:"48px 0",color:T.textMuted,fontSize:13}}>
          No candidates match your filters
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE: CANDIDATE DETAIL
════════════════════════════════════════════════════════════════════════════ */
function DetailPage({candidate:c,job,onBack}){
  const [tab,setTab]=useState("overview");
  const [regenLoading,setRegenLoading]=useState(false);
  const [questions,setQuestions]=useState(c.interviewQuestions||[]);

  const jobSkillsList=(job.skills||"").split(",").map(s=>s.trim()).filter(Boolean);
  const matched=c.matchedSkills||[];
  const missing=c.missingSkills||[];
  const col=clr(c.matchScore);

  const regenQuestions=async()=>{
    setRegenLoading(true);
    try{
      const raw=await callClaude(
        `Generate 5 tailored interview questions for ${c.name}, a ${c.title} with ${c.yearsExperience} years experience applying for ${job.title}. 
Their skills: ${(c.skills||[]).join(", ")}. Missing: ${(c.missingSkills||[]).join(", ")}. Red flags: ${(c.redFlags||[]).join(", ")||"none"}.
Return ONLY a JSON array of question strings.`,800
      );
      const clean=raw.replace(/```json|```/g,"").trim();
      const m=clean.match(/\[[\s\S]*\]/);
      if(m) setQuestions(JSON.parse(m[0]));
    }catch(e){ console.error(e); }
    setRegenLoading(false);
  };

  const TABS=["Overview","Skills","Experience","Interview","Gap Analysis"];

  return(
    <div style={{flex:1,overflowY:"auto",padding:"36px 40px"}} className="si">
      <button onClick={onBack} style={{background:"none",border:"none",color:T.textSub,
        cursor:"pointer",fontSize:13,marginBottom:24,display:"flex",alignItems:"center",gap:6,
        fontFamily:T.sans}}>← Back to Rankings</button>

      {/* Header */}
      <Card style={{padding:36,marginBottom:24,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:320,height:220,
          background:`radial-gradient(circle,${col}18,transparent)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",gap:26,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{width:82,height:82,borderRadius:20,flexShrink:0,
            background:`linear-gradient(135deg,${T.accent},${T.violet})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:32,fontWeight:900,color:"#fff"}}>
            {c.name?.charAt(0)||"?"}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:8}}>
              <h1 style={{fontFamily:T.serif,fontSize:28,fontWeight:700}}>{c.name}</h1>
              <Badge color={col}>{scoreLabel(c.matchScore)} Match</Badge>
              {(c.redFlags||[]).length>0&&<Badge color={T.rose} dot>{c.redFlags.length} Red Flag{c.redFlags.length>1?"s":""}</Badge>}
            </div>
            <div style={{fontSize:14,color:T.textMuted,marginBottom:14}}>
              {c.title} · {c.yearsExperience||0} years experience
            </div>
            <div style={{display:"flex",gap:22,flexWrap:"wrap"}}>
              {c.email&&<span style={{fontSize:12,color:T.textSub}}>✉ {c.email}</span>}
              {c.phone&&<span style={{fontSize:12,color:T.textSub}}>📞 {c.phone}</span>}
              {c.fileName&&<span style={{fontSize:12,color:T.textSub}}>📄 {c.fileName}</span>}
            </div>
          </div>
          <ScoreRing score={c.matchScore} size={96}/>
        </div>

        {c.summary&&(
          <div style={{marginTop:24,padding:"18px 20px",borderRadius:12,
            background:`${T.accent}0A`,border:`1px solid ${T.accent}1A`}}>
            <div style={{fontSize:10,color:T.accent,fontWeight:700,letterSpacing:".1em",
              textTransform:"uppercase",marginBottom:8}}>AI Summary</div>
            <p style={{fontSize:13,color:T.textSub,lineHeight:1.75,margin:0}}>{c.summary}</p>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:24,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t.toLowerCase().replace(" ","_"))}
            style={{background:"none",border:"none",cursor:"pointer",
              padding:"10px 18px",fontSize:12,fontWeight:600,letterSpacing:".03em",
              color:tab===t.toLowerCase().replace(" ","_")?T.accent:T.textSub,
              borderBottom:`2px solid ${tab===t.toLowerCase().replace(" ","_")?T.accent:"transparent"}`,
              fontFamily:T.sans,transition:"all .15s",marginBottom:-1}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}} className="fi">
          <Card style={{padding:28}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:18}}>Education</h3>
            <div style={{padding:14,background:T.surfaceHi,borderRadius:10,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:3}}>{(c.education||"—").split("—")[0]}</div>
              <div style={{fontSize:12,color:T.textMuted}}>{(c.education||"").split("—")[1]?.trim()}</div>
            </div>
            {(c.certifications||[]).length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:T.textSub,letterSpacing:".06em",
                  textTransform:"uppercase",marginBottom:12}}>Certifications</div>
                {c.certifications.map(cert=>(
                  <div key={cert} style={{display:"flex",alignItems:"center",gap:10,
                    padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{color:T.amber}}>🏆</span>
                    <span style={{fontSize:12}}>{cert}</span>
                  </div>
                ))}
              </>
            )}
          </Card>
          <Card style={{padding:28}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:18}}>Projects</h3>
            {(c.projects||[]).length===0
              ?<div style={{fontSize:13,color:T.textMuted}}>No projects listed</div>
              :c.projects.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"10px 0",
                  borderBottom:i<c.projects.length-1?`1px solid ${T.border}`:"none"}}>
                  <span style={{color:T.accent,flexShrink:0}}>▸</span>
                  <span style={{fontSize:12,color:T.textSub,lineHeight:1.6}}>{p}</span>
                </div>
              ))
            }
            {(c.redFlags||[]).length>0&&(
              <div style={{marginTop:20,padding:14,borderRadius:10,
                background:`${T.rose}0F`,border:`1px solid ${T.rose}25`}}>
                <div style={{fontSize:10,color:T.rose,fontWeight:700,letterSpacing:".08em",
                  textTransform:"uppercase",marginBottom:10}}>⚠ Red Flags</div>
                {c.redFlags.map((f,i)=>(
                  <div key={i} style={{fontSize:12,color:T.rose,padding:"3px 0"}}>• {f}</div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Skills ── */}
      {tab==="skills"&&(
        <div style={{display:"grid",gap:20}} className="fi">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <Card style={{padding:28}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>✓ Matched Skills</h3>
              <p style={{fontSize:12,color:T.textMuted,marginBottom:18}}>{matched.length} of {jobSkillsList.length||"?"} required skills present</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {matched.length===0
                  ?<span style={{fontSize:13,color:T.textMuted}}>None matched</span>
                  :matched.map(s=>(
                    <span key={s} style={{display:"inline-flex",alignItems:"center",gap:5,
                      padding:"5px 11px",borderRadius:7,fontSize:12,fontWeight:500,
                      background:`${T.emerald}12`,color:T.emerald,border:`1px solid ${T.emerald}28`}}>
                      ✓ {s}
                    </span>
                  ))
                }
              </div>
            </Card>
            <Card style={{padding:28}}>
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:6}}>✗ Missing Skills</h3>
              <p style={{fontSize:12,color:T.textMuted,marginBottom:18}}>{missing.length} required skill{missing.length!==1?"s":""} not found</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {missing.length===0
                  ?<span style={{fontSize:13,color:T.emerald,fontWeight:600}}>✓ All skills matched!</span>
                  :missing.map(s=>(
                    <span key={s} style={{display:"inline-flex",alignItems:"center",gap:5,
                      padding:"5px 11px",borderRadius:7,fontSize:12,fontWeight:500,
                      background:`${T.rose}12`,color:T.rose,border:`1px solid ${T.rose}28`}}>
                      ✗ {s}
                    </span>
                  ))
                }
              </div>
            </Card>
          </div>
          <Card style={{padding:28}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:18}}>All Candidate Skills</h3>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {(c.skills||[]).map(s=>(
                <span key={s} style={{padding:"5px 13px",borderRadius:7,fontSize:12,fontWeight:500,
                  background:`${T.accent}12`,color:T.accent,border:`1px solid ${T.accent}22`}}>{s}</span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Experience ── */}
      {tab==="experience"&&(
        <Card style={{padding:28}} className="fi">
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:20}}>Work History</h3>
          {(c.workHistory||[]).length===0
            ?<div style={{fontSize:13,color:T.textMuted}}>No work history extracted</div>
            :(c.workHistory||[]).map((w,i)=>(
              <div key={i} style={{display:"flex",gap:16,padding:"16px 0",
                borderBottom:i<c.workHistory.length-1?`1px solid ${T.border}`:"none"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:T.accent,
                  marginTop:4,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{w.split(":")[0]}</div>
                  {w.includes(":")&&(
                    <div style={{fontSize:12,color:T.textSub,lineHeight:1.6}}>{w.split(":").slice(1).join(":")}</div>
                  )}
                </div>
              </div>
            ))
          }
        </Card>
      )}

      {/* ── Interview ── */}
      {tab==="interview"&&(
        <div className="fi">
          <Card style={{padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h3 style={{fontSize:14,fontWeight:700,marginBottom:4}}>Interview Questions</h3>
                <p style={{fontSize:12,color:T.textMuted}}>AI-generated, tailored to {c.name}'s profile</p>
              </div>
              <Btn variant="secondary" small onClick={regenQuestions} disabled={regenLoading}>
                {regenLoading?<><Spinner size={14}/> Generating…</>:"✦ Regenerate"}
              </Btn>
            </div>
            <div style={{display:"grid",gap:12}}>
              {(questions||[]).map((q,i)=>(
                <div key={i} style={{display:"flex",gap:14,padding:"16px 18px",
                  borderRadius:12,background:T.surfaceHi,border:`1px solid ${T.border}`}}>
                  <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,
                    background:`${T.accent}18`,color:T.accent,display:"flex",
                    alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,fontFamily:T.mono}}>
                    {i+1}
                  </div>
                  <p style={{fontSize:13,color:T.textSub,lineHeight:1.7,margin:0}}>{q}</p>
                </div>
              ))}
              {(!questions||questions.length===0)&&(
                <div style={{textAlign:"center",padding:"24px 0",color:T.textMuted,fontSize:13}}>
                  No questions yet. Click Regenerate to create them.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ── Gap Analysis ── */}
      {tab==="gap_analysis"&&(
        <div style={{display:"grid",gap:20}} className="fi">
          <Card style={{padding:28}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:22}}>Score Breakdown</h3>
            <div style={{display:"grid",gap:18}}>
              {Object.entries(c.scoreBreakdown||{skills:0,experience:0,education:0,projects:0,certifications:0}).map(([k,v])=>(
                <ProgressBar key={k} pct={v} label={k.charAt(0).toUpperCase()+k.slice(1)} sub={v}
                  color={v>=80?T.emerald:v>=60?T.amber:v>=40?"#F97316":T.rose}/>
              ))}
            </div>
          </Card>
          <Card style={{padding:28}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:16}}>AI Gap Analysis</h3>
            <div style={{padding:"16px 20px",borderRadius:12,marginBottom:18,
              background:`${col}0D`,border:`1px solid ${col}22`}}>
              <p style={{fontSize:13,color:T.textSub,lineHeight:1.75,margin:0}}>{c.gapAnalysis||"No analysis available."}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{padding:16,borderRadius:10,background:`${T.emerald}0C`,border:`1px solid ${T.emerald}22`}}>
                <div style={{fontSize:10,fontWeight:700,color:T.emerald,letterSpacing:".08em",
                  textTransform:"uppercase",marginBottom:12}}>Strengths</div>
                {matched.slice(0,5).map(s=>(
                  <div key={s} style={{fontSize:12,color:T.textSub,padding:"3px 0"}}>✓ {s}</div>
                ))}
                {matched.length===0&&<div style={{fontSize:12,color:T.textMuted}}>No matched skills</div>}
              </div>
              <div style={{padding:16,borderRadius:10,background:`${T.rose}0C`,border:`1px solid ${T.rose}22`}}>
                <div style={{fontSize:10,fontWeight:700,color:T.rose,letterSpacing:".08em",
                  textTransform:"uppercase",marginBottom:12}}>To Develop</div>
                {missing.slice(0,5).map(s=>(
                  <div key={s} style={{fontSize:12,color:T.textSub,padding:"3px 0"}}>○ {s}</div>
                ))}
                {missing.length===0&&<div style={{fontSize:12,color:T.emerald,fontWeight:600}}>No gaps!</div>}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [page,setPage]=useState("dashboard");
  const [job,setJob]=useState({title:"",description:"",skills:"",experience:"",education:"",preferences:""});
  const [candidates,setCandidates]=useState([]);
  const [selected,setSelected]=useState(null);

  const goDetail=(c)=>{ setSelected(c); setPage("detail"); };

  // sorted candidates for display
  const ranked=[...candidates].sort((a,b)=>b.matchScore-a.matchScore);

  return(
    <>
      <style>{G}</style>
      <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
        {page!=="detail"&&(
          <Sidebar page={page} setPage={setPage} job={job} counts={{candidates:candidates.length}}/>
        )}
        <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
          {page==="dashboard"&&<DashboardPage job={job} candidates={ranked} setPage={setPage}/>}
          {page==="job"&&<JobPage job={job} setJob={setJob} setPage={setPage}/>}
          {page==="upload"&&<UploadPage job={job} candidates={candidates} setCandidates={setCandidates}/>}
          {page==="rankings"&&<RankingsPage candidates={ranked} job={job} onSelect={goDetail}/>}
          {page==="detail"&&selected&&<DetailPage candidate={selected} job={job} onBack={()=>setPage("rankings")}/>}
        </main>
      </div>
    </>
  );
}
