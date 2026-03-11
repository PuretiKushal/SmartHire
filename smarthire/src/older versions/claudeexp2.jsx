
// SmartHire — AI Recruitment Platform v5
// Company Account System | Recruiter + Hiring Manager Roles
// Light SaaS Theme | Full Feature Set

import { useState, useCallback, useRef, useEffect } from "react";
import * as mammoth from "mammoth";

/* ─── Logo (transparent background PNG) ─────────────────────────────────── */
// Logo loaded from uploaded file — transparent background preserved
const LOGO_SRC = "data:image/jpeg;base64,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";

/* ─── localStorage helpers ───────────────────────────────────────────────── */
const LS = {
  get:(k,fb=null)=>{ try{ const v=localStorage.getItem(k); return v!=null?JSON.parse(v):fb; }catch{return fb;} },
  set:(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
  del:(k)=>{ try{ localStorage.removeItem(k); }catch{} },
};

/* ─── Design Tokens — Light SaaS Theme ──────────────────────────────────── */
const T = {
  bg:          "#F8FAFC",
  bgAlt:       "#F1F5F9",
  surface:     "#FFFFFF",
  surfaceHi:   "#F8FAFC",
  surfaceHi2:  "#EFF6FF",
  border:      "#E5E7EB",
  borderHi:    "#BFDBFE",
  accent:      "#2563EB",
  accentHover: "#1D4ED8",
  accentLight: "#EFF6FF",
  accentGlow:  "rgba(37,99,235,0.15)",
  secondary:   "#6366F1",
  secondaryLight:"#EEF2FF",
  emerald:     "#10B981",
  emeraldLight:"#ECFDF5",
  amber:       "#F59E0B",
  amberLight:  "#FFFBEB",
  rose:        "#EF4444",
  roseLight:   "#FEF2F2",
  violet:      "#7C3AED",
  violetLight: "#F5F3FF",
  text:        "#111827",
  textSub:     "#374151",
  textMuted:   "#6B7280",
  textLight:   "#9CA3AF",
  gradPrimary: "linear-gradient(135deg,#2563EB,#6366F1)",
  gradSuccess: "linear-gradient(135deg,#10B981,#059669)",
  gradDanger:  "linear-gradient(135deg,#EF4444,#DC2626)",
  gradAmber:   "linear-gradient(135deg,#F59E0B,#D97706)",
  mono:        "'JetBrains Mono','IBM Plex Mono',monospace",
  sans:        "'DM Sans','Plus Jakarta Sans',sans-serif",
  display:     "'Sora','Plus Jakarta Sans',sans-serif",
  shadow:      "0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06)",
  shadowMd:    "0 4px 6px -1px rgba(0,0,0,.08),0 2px 4px -1px rgba(0,0,0,.06)",
  shadowLg:    "0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -2px rgba(0,0,0,.04)",
  shadowXl:    "0 20px 25px -5px rgba(0,0,0,.08),0 10px 10px -5px rgba(0,0,0,.04)",
};

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Sora:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;width:100%;overflow:hidden}
body{background:${T.bg};color:${T.text};font-family:${T.sans};-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:${T.bgAlt}}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#CBD5E1}
input,textarea,select{font-family:${T.sans}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .38s cubic-bezier(.22,1,.36,1) both}
.fi{animation:fadeIn .25s ease both}
.si{animation:slideIn .3s cubic-bezier(.22,1,.36,1) both}
.su{animation:slideUp .25s cubic-bezier(.22,1,.36,1) both}
`;

/* ─── Tiny helpers ───────────────────────────────────────────────────────── */
const clr = (score) => score >= 80 ? T.emerald : score >= 60 ? T.amber : score >= 40 ? "#F97316" : T.rose;
const clrBg = (score) => score >= 80 ? T.emeraldLight : score >= 60 ? T.amberLight : score >= 40 ? "#FFF7ED" : T.roseLight;
function scoreLabel(s){ return s>=80?"Excellent":s>=60?"Good":s>=40?"Fair":"Poor" }
function fmtSize(b){ return b>1e6?`${(b/1e6).toFixed(1)} MB`:`${(b/1024).toFixed(0)} KB` }

const STATUS_CONFIG = {
  applied:     { label:"Applied",     color:T.accent,   bg:T.accentLight,   icon:"📋" },
  shortlisted: { label:"Shortlisted", color:T.emerald,  bg:T.emeraldLight,  icon:"✅" },
  rejected:    { label:"Rejected",    color:T.rose,     bg:T.roseLight,     icon:"❌" },
};

const PIPELINE = ["Applied","Screened","Shortlisted","Interview","Offer"];

/* ─── Reusable UI Atoms ──────────────────────────────────────────────────── */
const Spinner = ({size=18,color=T.accent}) => (
  <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",
    border:`2px solid ${color}30`,borderTopColor:color,
    animation:"spin .7s linear infinite",flexShrink:0}}/>
);

const Badge = ({children,color=T.accent,bg,dot,style:sx})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:5,
    padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,
    letterSpacing:".03em",
    background:bg||`${color}12`,color,border:`1px solid ${color}25`,
    fontFamily:T.mono,whiteSpace:"nowrap",...sx}}>
    {dot&&<span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block"}}/>}
    {children}
  </span>
);

function Btn({children,onClick,variant="primary",disabled,small,icon,style:sx}){
  const [h,setH]=useState(false);
  const base={
    display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
    padding:small?"7px 14px":"10px 20px",
    borderRadius:8,fontSize:small?12:13,fontWeight:600,
    cursor:disabled?"not-allowed":"pointer",
    transition:"all .15s ease",border:"none",outline:"none",
    opacity:disabled?.5:1,fontFamily:T.sans,letterSpacing:".01em",...sx
  };
  const v={
    primary:{background:h&&!disabled?T.accentHover:T.accent,color:"#fff",
      boxShadow:h&&!disabled?`0 4px 12px ${T.accentGlow}`:T.shadow},
    secondary:{background:h&&!disabled?T.bgAlt:T.surface,color:T.textSub,
      border:`1px solid ${T.border}`,boxShadow:T.shadow},
    ghost:{background:h&&!disabled?T.bgAlt:"transparent",color:T.textMuted,border:"1px solid transparent"},
    danger:{background:h&&!disabled?"#DC2626":T.rose,color:"#fff",
      boxShadow:h&&!disabled?"0 4px 12px rgba(239,68,68,.25)":T.shadow},
    success:{background:h&&!disabled?"#059669":T.emerald,color:"#fff",
      boxShadow:h&&!disabled?"0 4px 12px rgba(16,185,129,.25)":T.shadow},
    amber:{background:h&&!disabled?"#D97706":T.amber,color:"#fff"},
    gradient:{background:T.gradPrimary,color:"#fff",
      boxShadow:h&&!disabled?`0 6px 20px ${T.accentGlow}`:T.shadow,
      transform:h&&!disabled?"translateY(-1px)":"none"},
    outline:{background:"transparent",color:T.accent,border:`1.5px solid ${T.accent}`,
      boxShadow:"none"},
  };
  return(
    <button style={{...base,...v[variant]}} onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}>
      {icon&&<span style={{fontSize:small?12:13}}>{icon}</span>}{children}
    </button>
  );
}

function Card({children,style:sx,onClick,hover=true,bordered}){
  const [h,setH]=useState(false);
  return(
    <div onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:T.surface,
        border:`1px solid ${h&&hover&&onClick?T.borderHi:bordered?T.border:T.border}`,
        borderRadius:12,transition:"all .18s ease",
        cursor:onClick?"pointer":"default",
        transform:h&&hover&&onClick?"translateY(-1px)":"none",
        boxShadow:h&&hover&&onClick?T.shadowLg:T.shadow,...sx}}>
      {children}
    </div>
  );
}

function Input({label,value,onChange,placeholder,required,multiline,rows=4,style:sx,type="text",hint}){
  const [f,setF]=useState(false);
  const shared={width:"100%",padding:"10px 13px",
    background:T.surface,border:`1.5px solid ${f?T.accent:T.border}`,
    borderRadius:8,color:T.text,fontSize:13,fontFamily:T.sans,
    outline:"none",transition:"border-color .15s",lineHeight:1.6,...sx};
  return(
    <div>
      {label&&<label style={{display:"block",fontSize:12,fontWeight:600,
        color:T.textSub,marginBottom:6,letterSpacing:".02em"}}>
        {label}{required&&<span style={{color:T.rose,marginLeft:3}}>*</span>}
      </label>}
      {multiline
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
            placeholder={placeholder} style={{...shared,resize:"vertical"}}
            onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)}
            placeholder={placeholder} style={shared}
            onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
      }
      {hint&&<div style={{fontSize:11,color:T.textLight,marginTop:4}}>{hint}</div>}
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
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${c}20`} strokeWidth={5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={5}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{transition:"stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:size*.22,fontWeight:800,color:c,fontFamily:T.mono,lineHeight:1}}>{score}</span>
        <span style={{fontSize:size*.1,color:T.textMuted,fontFamily:T.mono}}>%</span>
      </div>
    </div>
  );
}

function ProgressBar({pct,color=T.accent,label,sub}){
  return(
    <div>
      {(label||sub!=null)&&(
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
          {label&&<span style={{fontSize:12,color:T.textSub}}>{label}</span>}
          {sub!=null&&<span style={{fontSize:12,fontFamily:T.mono,color,fontWeight:600}}>{sub}%</span>}
        </div>
      )}
      <div style={{height:6,background:`${color}15`,borderRadius:3,overflow:"hidden"}}>
        <div style={{"--w":`${pct}%`,width:`${pct}%`,height:"100%",
          background:color,borderRadius:3,
          animation:"barGrow 1s cubic-bezier(.4,0,.2,1) both"}}/>
      </div>
    </div>
  );
}

function PipelineTracker({status}){
  const stages=PIPELINE;
  const idx = status==="shortlisted"?2 : status==="rejected"?-1 : status==="interview"?3 : status==="offer"?4 : 1;
  const isRejected = status==="rejected";
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:0}}>
      {stages.map((s,i)=>{
        const done = !isRejected && i<=idx;
        const active = !isRejected && i===idx;
        return(
          <div key={s} style={{display:"flex",alignItems:"center",flex:1}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:26,height:26,borderRadius:"50%",
                background:done?(active?T.accent:T.emerald):isRejected&&i===0?T.rose:T.bgAlt,
                border:`2px solid ${done?(active?T.accent:T.emerald):isRejected&&i===0?T.rose:T.border}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:700,color:done?"#fff":T.textMuted,
                transition:"all .3s",flexShrink:0}}>
                {done?(active?"●":"✓"):(isRejected&&i===0?"✗":"○")}
              </div>
              <span style={{fontSize:9,color:done?T.accent:T.textLight,fontWeight:done?600:400,
                textTransform:"uppercase",letterSpacing:".04em",whiteSpace:"nowrap"}}>{s}</span>
            </div>
            {i<stages.length-1&&(
              <div style={{flex:1,height:2,margin:"0 4px",marginBottom:16,
                background:done&&i<idx?T.emerald:T.border}}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── PDF/DOCX extraction ────────────────────────────────────────────────── */
async function extractPDF(file){
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

async function extractDOCX(file){
  const buf=await file.arrayBuffer();
  const result=await mammoth.extractRawText({arrayBuffer:buf});
  return result.value;
}

async function extractText(file){
  const name=file.name.toLowerCase();
  if(name.endsWith(".pdf")) return extractPDF(file);
  if(name.endsWith(".docx")||name.endsWith(".doc")) return extractDOCX(file);
  throw new Error("Unsupported format");
}

/* ─── AI via Puter.js ────────────────────────────────────────────────────── */
function loadPuter(){
  return new Promise((res,rej)=>{
    if(window.puter){res(window.puter);return;}
    const s=document.createElement("script");
    s.src="https://js.puter.com/v2/";
    s.onload=()=>res(window.puter);
    s.onerror=()=>rej(new Error("Failed to load Puter.js"));
    document.head.appendChild(s);
  });
}

async function callAI(prompt){
  const puter=await loadPuter();
  const models=["gpt-4o-mini","claude-3-5-haiku"];
  let lastErr;
  for(const model of models){
    try{
      const resp=await puter.ai.chat(prompt,{model});
      const text=
        (typeof resp==="string"?resp:null)||
        resp?.message?.content||
        resp?.content||
        (Array.isArray(resp?.message?.content)
          ?resp.message.content.map(b=>b.text||"").join("")
          :null)||
        "";
      if(!text) throw new Error("Empty response");
      return text;
    }catch(e){
      lastErr=e;
    }
  }
  throw new Error(lastErr?.message||"AI request failed");
}

function extractJSON(raw){
  const cleaned=raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try{return JSON.parse(cleaned);}catch(_){}
  const m=cleaned.match(/\{[\s\S]*\}/);
  if(m){try{return JSON.parse(m[0]);}catch(_){}}
  throw new Error("Could not parse AI response as JSON");
}

async function analyzeResume(resumeText, jobTitle, jobDescription, jobSkills, jobExperience, jobEducation){
  const prompt=`You are an expert HR AI. Analyze this resume against the job requirements and return ONLY valid JSON (no markdown, no explanation).

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
REQUIRED SKILLS: ${jobSkills}
EXPERIENCE REQUIREMENT: ${jobExperience}
EDUCATION REQUIREMENT: ${jobEducation}

RESUME TEXT:
${resumeText.slice(0,4000)}

Return ONLY this exact JSON structure:
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
    "skills": 80,
    "experience": 75,
    "education": 70,
    "projects": 60,
    "certifications": 50
  },
  "interviewQuestions": ["Q1","Q2","Q3","Q4","Q5"]
}

matchScore must be 0-100 integer. scoreBreakdown values must each be 0-100 integers.`;

  let lastErr;
  for(let attempt=0;attempt<2;attempt++){
    try{
      const raw=await callAI(prompt);
      const parsed=extractJSON(raw);
      if(typeof parsed.matchScore!=="number") throw new Error("Invalid schema");
      const MISSING="This detail is not found in the resume";
      return {
        name:             parsed.name||"Unknown",
        email:            (parsed.email&&parsed.email!=="N/A"&&parsed.email!=="null")?parsed.email:MISSING,
        phone:            (parsed.phone&&parsed.phone!=="N/A"&&parsed.phone!=="null")?parsed.phone:MISSING,
        title:            parsed.title||"",
        yearsExperience:  Number(parsed.yearsExperience)||0,
        skills:           Array.isArray(parsed.skills)?parsed.skills:[],
        matchedSkills:    Array.isArray(parsed.matchedSkills)?parsed.matchedSkills:[],
        missingSkills:    Array.isArray(parsed.missingSkills)?parsed.missingSkills:[],
        education:        (parsed.education&&parsed.education!=="N/A"&&parsed.education!=="null")?parsed.education:MISSING,
        certifications:   Array.isArray(parsed.certifications)&&parsed.certifications.length?parsed.certifications:[],
        projects:         Array.isArray(parsed.projects)?parsed.projects:[],
        workHistory:      Array.isArray(parsed.workHistory)?parsed.workHistory:[],
        summary:          parsed.summary||"",
        redFlags:         Array.isArray(parsed.redFlags)?parsed.redFlags:[],
        gapAnalysis:      parsed.gapAnalysis||"",
        matchScore:       Math.min(100,Math.max(0,Math.round(parsed.matchScore))),
        scoreBreakdown:{
          skills:         Number(parsed.scoreBreakdown?.skills)||0,
          experience:     Number(parsed.scoreBreakdown?.experience)||0,
          education:      Number(parsed.scoreBreakdown?.education)||0,
          projects:       Number(parsed.scoreBreakdown?.projects)||0,
          certifications: Number(parsed.scoreBreakdown?.certifications)||0,
        },
        interviewQuestions:Array.isArray(parsed.interviewQuestions)?parsed.interviewQuestions:[],
      };
    }catch(e){
      lastErr=e;
      if(attempt===0) await new Promise(r=>setTimeout(r,600));
    }
  }
  throw new Error(lastErr?.message||"Resume analysis failed");
}

/* ─── CSV / Excel export ─────────────────────────────────────────────────── */
function exportCSV(candidates){
  const headers=["Rank","Name","Email","Phone","Match Score","Score Label","Skills","Matched Skills","Missing Skills","Experience (yrs)","Education","Red Flags"];
  const rows=candidates.map((c,i)=>[
    i+1,
    `"${(c.name||"").replace(/"/g,'""')}"`,
    `"${(c.email||"").replace(/"/g,'""')}"`,
    `"${(c.phone||"").replace(/"/g,'""')}"`,
    c.matchScore||0,
    scoreLabel(c.matchScore||0),
    `"${(c.skills||[]).join("; ").replace(/"/g,'""')}"`,
    `"${(c.matchedSkills||[]).join("; ").replace(/"/g,'""')}"`,
    `"${(c.missingSkills||[]).join("; ").replace(/"/g,'""')}"`,
    c.yearsExperience||0,
    `"${(c.education||"").replace(/"/g,'""')}"`,
    `"${(c.redFlags||[]).join("; ").replace(/"/g,'""')}"`,
  ]);
  const csv=[headers,...rows].map(r=>r.join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="SmartHire_Rankings.csv"; a.click();
  URL.revokeObjectURL(url);
}

function loadScript(src,globalKey){
  return new Promise((res,rej)=>{
    if(window[globalKey]){res();return;}
    const s=document.createElement("script");
    s.src=src; s.onload=res; s.onerror=rej;
    document.head.appendChild(s);
  });
}

async function exportExcel(candidates){
  try{
    await loadScript("https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js","XLSX");
    const XLSX=window.XLSX;
    const header=["Rank","Name","Email","Phone","Match Score","Score Label","Skills","Matched Skills","Missing Skills","Experience (yrs)","Education","Red Flags"];
    const rows=candidates.map((c,i)=>[
      i+1, c.name||"", c.email||"", c.phone||"",
      c.matchScore||0, scoreLabel(c.matchScore||0),
      (c.skills||[]).join(", "),
      (c.matchedSkills||[]).join(", "),
      (c.missingSkills||[]).join(", "),
      c.yearsExperience||0,
      c.education||"",
      (c.redFlags||[]).join("; "),
    ]);
    const ws=XLSX.utils.aoa_to_sheet([header,...rows]);
    ws["!cols"]=[6,22,28,16,12,12,40,35,30,14,35,35].map(wch=>({wch}));
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Rankings");
    XLSX.writeFile(wb,"SmartHire_Rankings.xlsx");
  }catch(e){
    exportCSV(candidates);
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   AUTH PAGES — Company Signup, Role Creation, Login
════════════════════════════════════════════════════════════════════════════ */

/* ─── Logo component for auth pages ─────────────────────────────────────── */
function AuthLogo({size=88}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:28}}>
      <div style={{background:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <img src={LOGO_SRC} alt="SmartHire"
          style={{height:size,width:"auto",objectFit:"contain",background:"transparent",display:"block",mixBlendMode:"multiply"}}/>
      </div>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontFamily:T.display,fontSize:22,fontWeight:800,color:T.text,letterSpacing:"-.03em",lineHeight:1}}>SmartHire</h1>
        <p style={{fontSize:12,color:T.textMuted,marginTop:3}}>AI Recruitment Platform</p>
      </div>
    </div>
  );
}

/* ─── Auth Container ─────────────────────────────────────────────────────── */
function AuthContainer({children,title,subtitle,maxWidth=440}){
  return(
    <div style={{minHeight:"100vh",width:"100%",background:T.bg,
      display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px",
      overflowY:"auto"}} className="fu">
      <div style={{width:"100%",maxWidth}}>
        <AuthLogo/>
        {(title||subtitle)&&(
          <div style={{textAlign:"center",marginBottom:24}}>
            {title&&<h2 style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:4}}>{title}</h2>}
            {subtitle&&<p style={{fontSize:13,color:T.textMuted}}>{subtitle}</p>}
          </div>
        )}
        <div style={{background:T.surface,borderRadius:16,padding:32,
          border:`1px solid ${T.border}`,boxShadow:T.shadowLg}}>
          {children}
        </div>
        <p style={{textAlign:"center",fontSize:12,color:T.textLight,marginTop:16}}>
          © 2025 SmartHire. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function ErrMsg({msg}){
  if(!msg) return null;
  return(
    <div style={{padding:"10px 13px",borderRadius:8,marginBottom:16,
      background:T.roseLight,border:`1px solid #FECACA`,
      color:T.rose,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
      <span>⚠</span>{msg}
    </div>
  );
}

/* ─── COMPANY SIGNUP ─────────────────────────────────────────────────────── */
function SignupPage({onCompanyCreated,goLogin}){
  const [f,setF]=useState({companyName:"",companyEmail:"",companyPassword:""});
  const [err,setErr]=useState("");
  const [showPass,setShowPass]=useState(false);

  const submit=()=>{
    if(!f.companyName||!f.companyEmail||!f.companyPassword){
      setErr("All fields are required"); return;
    }
    const companies=LS.get("sh_companies",[]);
    if(companies.find(c=>c.companyEmail.toLowerCase()===f.companyEmail.toLowerCase())){
      setErr("An account with this company email already exists"); return;
    }
    const company={
      companyId:"co_"+Date.now(),
      companyName:f.companyName,
      companyEmail:f.companyEmail,
      companyPassword:f.companyPassword,
      recruiters:[],
      managers:[],
      jobs:[],
      createdAt:Date.now(),
    };
    LS.set("sh_companies",[...companies,company]);
    onCompanyCreated(company);
  };

  return(
    <AuthContainer title="Create Company Account" subtitle="Set up your company's recruitment hub">
      <ErrMsg msg={err}/>
      <div style={{display:"grid",gap:16}}>
        <Input label="Company Name" value={f.companyName}
          onChange={v=>{setF(x=>({...x,companyName:v}));setErr("");}}
          placeholder="Acme Corporation" required/>
        <Input label="Company Email" value={f.companyEmail} type="email"
          onChange={v=>{setF(x=>({...x,companyEmail:v}));setErr("");}}
          placeholder="hr@yourcompany.com" required/>
        <div style={{position:"relative"}}>
          <Input label="Company Password" value={f.companyPassword}
            onChange={v=>{setF(x=>({...x,companyPassword:v}));setErr("");}}
            placeholder="Create a secure password" required
            style={{paddingRight:50}} type={showPass?"text":"password"}/>
          <button onClick={()=>setShowPass(x=>!x)}
            style={{position:"absolute",right:12,bottom:10,background:"none",border:"none",
              color:T.textMuted,cursor:"pointer",fontSize:12,fontFamily:T.sans}}>
            {showPass?"Hide":"Show"}
          </button>
        </div>
      </div>
      <Btn onClick={submit} variant="gradient" style={{width:"100%",marginTop:20,padding:"12px"}}>
        Create Company Account →
      </Btn>
      <div style={{textAlign:"center",marginTop:16}}>
        <button onClick={goLogin} style={{background:"none",border:"none",cursor:"pointer",
          fontSize:13,color:T.accent,fontFamily:T.sans}}>
          Already have an account? Sign in
        </button>
      </div>
    </AuthContainer>
  );
}

/* ─── ROLE ACCOUNT CREATION ──────────────────────────────────────────────── */
function CreateRolePage({company,onRoleCreated,onSkip}){
  const [view,setView]=useState("choose"); // "choose" | "recruiter" | "manager"
  const [f,setF]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState("");

  const createRole=(roleType)=>{
    if(!f.name||!f.email){setErr("Name and email are required");return;}
    const companies=LS.get("sh_companies",[]);
    const co=companies.find(c=>c.companyId===company.companyId);
    if(!co){setErr("Company not found");return;}
    const roleAccount={
      roleId:"r_"+Date.now(),
      name:f.name,
      email:f.email,
      password:f.password||null,
      roleType,
      companyId:company.companyId,
    };
    const updatedCo={
      ...co,
      recruiters:roleType==="recruiter"?[...(co.recruiters||[]),roleAccount]:co.recruiters||[],
      managers:roleType==="manager"?[...(co.managers||[]),roleAccount]:co.managers||[],
    };
    const updatedCompanies=companies.map(c=>c.companyId===company.companyId?updatedCo:c);
    LS.set("sh_companies",updatedCompanies);
    onRoleCreated(updatedCo,roleAccount,roleType);
  };

  if(view==="choose"){
    return(
      <AuthContainer title="Create Role Accounts" subtitle={`Set up access roles for ${company.companyName}`}>
        <p style={{fontSize:13,color:T.textMuted,marginBottom:20,textAlign:"center"}}>
          Your company account is ready! Now create role accounts for your team.
        </p>
        <div style={{display:"grid",gap:12,marginBottom:20}}>
          {[
            {type:"recruiter",icon:"🔍",title:"Recruiter Account",desc:"Can post jobs, upload resumes, run AI analysis, and view rankings",color:T.accent},
            {type:"manager",icon:"👔",title:"Hiring Manager Account",desc:"Can review candidates, shortlist, reject, and send emails",color:T.secondary},
          ].map(r=>(
            <div key={r.type} onClick={()=>{setView(r.type);setF({name:"",email:"",password:""});setErr("");}}
              style={{padding:"18px 20px",borderRadius:12,border:`1.5px solid ${T.border}`,
                cursor:"pointer",transition:"all .15s",background:T.surface,
                display:"flex",gap:14,alignItems:"flex-start"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color;e.currentTarget.style.background=`${r.color}08`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}>
              <span style={{fontSize:24}}>{r.icon}</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>{r.title}</div>
                <div style={{fontSize:12,color:T.textMuted,lineHeight:1.5}}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",paddingTop:16,borderTop:`1px solid ${T.border}`}}>
          <button onClick={onSkip} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:13,color:T.textMuted,fontFamily:T.sans}}>
            Skip for now — I'll create roles later →
          </button>
        </div>
      </AuthContainer>
    );
  }

  const isRecruiter=view==="recruiter";
  return(
    <AuthContainer
      title={isRecruiter?"Create Recruiter Account":"Create Hiring Manager Account"}
      subtitle={`For ${company.companyName}`}>
      <ErrMsg msg={err}/>
      <div style={{display:"grid",gap:16}}>
        <Input label={isRecruiter?"Recruiter Name":"Manager Name"} value={f.name}
          onChange={v=>{setF(x=>({...x,name:v}));setErr("");}}
          placeholder={isRecruiter?"Jane Smith":"John Doe"} required/>
        <Input label={isRecruiter?"Recruiter Email":"Manager Email"} value={f.email} type="email"
          onChange={v=>{setF(x=>({...x,email:v}));setErr("");}}
          placeholder={isRecruiter?"jane@company.com":"john@company.com"} required/>
        <Input label="Optional Password" value={f.password}
          onChange={v=>setF(x=>({...x,password:v}))}
          placeholder="Leave empty if no separate password needed"
          type="password"
          hint="Set a password to restrict access to this role dashboard"/>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <Btn variant={isRecruiter?"primary":"secondary"}
          style={{flex:1,padding:"11px",background:isRecruiter?T.accent:T.secondary,color:"#fff"}}
          onClick={()=>createRole(view)}>
          Create {isRecruiter?"Recruiter":"Manager"} Account →
        </Btn>
        <Btn variant="secondary" onClick={()=>{setView("choose");setErr("");}}>Back</Btn>
      </div>
    </AuthContainer>
  );
}

/* ─── LOGIN PAGE ─────────────────────────────────────────────────────────── */
function LoginPage({onLogin,goSignup}){
  const [f,setF]=useState({email:"",password:""});
  const [step,setStep]=useState("company"); // "company" | "role"
  const [foundCompany,setFoundCompany]=useState(null);
  const [roleType,setRoleType]=useState(null);
  const [rolePassword,setRolePassword]=useState("");
  const [err,setErr]=useState("");
  const [showPass,setShowPass]=useState(false);

  const loginCompany=()=>{
    if(!f.email||!f.password){setErr("Please fill all fields");return;}
    const companies=LS.get("sh_companies",[]);
    const co=companies.find(c=>
      c.companyEmail.toLowerCase()===f.email.toLowerCase()&&
      c.companyPassword===f.password
    );
    if(!co){setErr("Invalid company email or password");return;}
    setFoundCompany(co);
    setStep("role");
    setErr("");
  };

  const loginRole=(type)=>{
    const co=foundCompany;
    const roles=type==="recruiter"?(co.recruiters||[]):(co.managers||[]);
    if(roles.length===0){
      setErr(`No ${type} accounts exist for this company. Please create one first.`);return;
    }
    setRoleType(type);
    // Check if any role in this type has a password
    const hasPassword=roles.some(r=>r.password);
    if(!hasPassword){
      // No password needed, pick first role or show selection if multiple
      if(roles.length===1){
        doLogin(co,roles[0],type);
      } else {
        setStep("selectRole");
      }
    } else {
      setStep("rolePassword");
    }
  };

  const doLogin=(company,roleAccount,type)=>{
    const session={
      companyId:company.companyId,
      companyName:company.companyName,
      companyEmail:company.companyEmail,
      roleId:roleAccount.roleId,
      name:roleAccount.name,
      email:roleAccount.email,
      role:type,
      id:roleAccount.roleId,
      jobs:company.jobs||[],
    };
    LS.set("sh_session",session);
    onLogin(session,company);
  };

  const verifyRolePassword=()=>{
    const co=foundCompany;
    const roles=type==="recruiter"?(co.recruiters||[]):(co.managers||[]);
    const match=roles.find(r=>r.password===rolePassword)||roles.find(r=>!r.password);
    if(!match){setErr("Incorrect role password");return;}
    doLogin(co,match,roleType);
  };
  const type=roleType;

  if(step==="company"){
    return(
      <AuthContainer title="Welcome Back" subtitle="Sign in to your recruitment dashboard">
        <ErrMsg msg={err}/>
        <div style={{display:"grid",gap:16}}>
          <Input label="Company Email" value={f.email} type="email"
            onChange={v=>{setF(x=>({...x,email:v}));setErr("");}}
            placeholder="hr@yourcompany.com" required/>
          <div style={{position:"relative"}}>
            <Input label="Company Password" value={f.password}
              onChange={v=>{setF(x=>({...x,password:v}));setErr("");}}
              placeholder="Your company password" required
              style={{paddingRight:50}} type={showPass?"text":"password"}/>
            <button onClick={()=>setShowPass(x=>!x)}
              style={{position:"absolute",right:12,bottom:10,background:"none",border:"none",
                color:T.textMuted,cursor:"pointer",fontSize:12,fontFamily:T.sans}}>
              {showPass?"Hide":"Show"}
            </button>
          </div>
        </div>
        <Btn onClick={loginCompany} variant="gradient" style={{width:"100%",marginTop:20,padding:"12px"}}>
          Continue →
        </Btn>
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={goSignup} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:13,color:T.accent,fontFamily:T.sans}}>
            New company? Create account
          </button>
        </div>
      </AuthContainer>
    );
  }

  if(step==="role"){
    const co=foundCompany;
    return(
      <AuthContainer title="Select Your Role" subtitle={`Logged in as ${co.companyName}`}>
        <ErrMsg msg={err}/>
        <p style={{fontSize:13,color:T.textMuted,marginBottom:20,textAlign:"center"}}>
          Choose how you'd like to continue:
        </p>
        <div style={{display:"grid",gap:12,marginBottom:16}}>
          {[
            {type:"recruiter",icon:"🔍",label:"Login as Recruiter",
              desc:`${(co.recruiters||[]).length} recruiter account(s)`,
              color:T.accent,disabled:(co.recruiters||[]).length===0},
            {type:"manager",icon:"👔",label:"Login as Hiring Manager",
              desc:`${(co.managers||[]).length} manager account(s)`,
              color:T.secondary,disabled:(co.managers||[]).length===0},
          ].map(r=>(
            <div key={r.type}
              onClick={()=>!r.disabled&&loginRole(r.type)}
              style={{padding:"16px 18px",borderRadius:12,
                border:`1.5px solid ${r.disabled?T.border:T.border}`,
                cursor:r.disabled?"not-allowed":"pointer",
                transition:"all .15s",background:r.disabled?T.bgAlt:T.surface,
                display:"flex",gap:14,alignItems:"center",
                opacity:r.disabled?.5:1}}
              onMouseEnter={e=>{if(!r.disabled){e.currentTarget.style.borderColor=r.color;e.currentTarget.style.background=`${r.color}08`;}}}
              onMouseLeave={e=>{if(!r.disabled){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}}>
              <span style={{fontSize:22}}>{r.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:r.disabled?T.textMuted:T.text}}>{r.label}</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{r.disabled?"No accounts created yet":r.desc}</div>
              </div>
              {!r.disabled&&<span style={{color:T.textLight}}>›</span>}
            </div>
          ))}
        </div>
        <Btn variant="ghost" style={{width:"100%"}} onClick={()=>{setStep("company");setErr("");}}>← Back</Btn>
      </AuthContainer>
    );
  }

  if(step==="rolePassword"){
    return(
      <AuthContainer title={`${type==="recruiter"?"Recruiter":"Manager"} Password`}
        subtitle="This role is password-protected">
        <ErrMsg msg={err}/>
        <Input label="Role Password" value={rolePassword} type="password"
          onChange={v=>{setRolePassword(v);setErr("");}}
          placeholder="Enter role password"/>
        <div style={{display:"grid",gap:10,marginTop:20}}>
          <Btn variant="gradient" style={{padding:"12px"}} onClick={verifyRolePassword}>
            Access Dashboard →
          </Btn>
          <Btn variant="secondary" onClick={()=>{setStep("role");setErr("");}}>← Back</Btn>
        </div>
      </AuthContainer>
    );
  }

  if(step==="selectRole"){
    const co=foundCompany;
    const roles=type==="recruiter"?(co.recruiters||[]):(co.managers||[]);
    return(
      <AuthContainer title="Select Account" subtitle={`Multiple ${type} accounts found`}>
        <ErrMsg msg={err}/>
        <div style={{display:"grid",gap:8,marginBottom:16}}>
          {roles.map(r=>(
            <div key={r.roleId} onClick={()=>doLogin(co,r,type)}
              style={{padding:"14px 16px",borderRadius:10,border:`1px solid ${T.border}`,
                cursor:"pointer",display:"flex",alignItems:"center",gap:12,
                transition:"all .15s",background:T.surface}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.background=T.accentLight;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:T.gradPrimary,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{r.name}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{r.email}</div>
              </div>
              <span style={{marginLeft:"auto",color:T.textLight}}>›</span>
            </div>
          ))}
        </div>
        <Btn variant="secondary" style={{width:"100%"}} onClick={()=>{setStep("role");setErr("");}}>← Back</Btn>
      </AuthContainer>
    );
  }

  return null;
}

/* ════════════════════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════════════════ */
function Sidebar({page,setPage,job,counts,currentUser,onProfileClick,onSelectJob,onNewJob,company}){
  const jobs=(company?.jobs)||[];
  const [jobsExpanded,setJobsExpanded]=useState(true);
  const role = currentUser?.role||"recruiter";
  const isRecruiter = role==="recruiter";

  const NAV_RECRUITER=[
    {id:"dashboard",icon:"⊞",label:"Dashboard"},
    {id:"job",icon:"✦",label:"Job Setup"},
    {id:"upload",icon:"↑",label:"Upload Resumes"},
    {id:"rankings",icon:"≡",label:"Rankings"},
  ];
  const NAV_MANAGER=[
    {id:"dashboard",icon:"⊞",label:"Dashboard"},
    {id:"rankings",icon:"≡",label:"All Candidates"},
    {id:"shortlisted",icon:"✅",label:"Shortlisted"},
    {id:"rejected",icon:"❌",label:"Rejected"},
  ];
  const NAV = isRecruiter ? NAV_RECRUITER : NAV_MANAGER;

  return(
    <aside style={{width:232,background:T.surface,borderRight:`1px solid ${T.border}`,
      display:"flex",flexDirection:"column",flexShrink:0,zIndex:20,
      boxShadow:"2px 0 8px rgba(0,0,0,.04)"}}>

      {/* Logo + Brand */}
      <div style={{padding:"16px 18px 14px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"transparent",display:"flex",alignItems:"center"}}>
            <img src={LOGO_SRC} alt="SmartHire"
              style={{height:38,width:"auto",objectFit:"contain",display:"block",
                background:"transparent",mixBlendMode:"multiply"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:800,letterSpacing:"-.02em",color:T.text,lineHeight:1}}>SmartHire</div>
            <div style={{fontSize:10,color:isRecruiter?T.accent:T.secondary,fontWeight:600,
              letterSpacing:".04em",textTransform:"uppercase",marginTop:2}}>
              {isRecruiter?"Recruiter":"Hiring Manager"}
            </div>
          </div>
        </div>
      </div>

      {/* Company badge */}
      {company?.companyName&&(
        <div style={{padding:"10px 14px",background:`${T.accent}06`,borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,color:T.textLight,marginBottom:1,textTransform:"uppercase",letterSpacing:".06em",fontWeight:600}}>Company</div>
          <div style={{fontSize:12,fontWeight:700,color:T.textSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{company.companyName}</div>
        </div>
      )}

      {/* Nav */}
      <nav style={{padding:"12px 10px",flex:1,overflowY:"auto"}}>
        {/* Active job badge */}
        {job.title&&(
          <div style={{margin:"0 4px 12px",padding:"10px 12px",borderRadius:10,
            background:T.accentLight,border:`1px solid ${T.borderHi}`}}>
            <div style={{fontSize:10,color:T.accent,fontWeight:700,letterSpacing:".06em",
              textTransform:"uppercase",marginBottom:2}}>Active Job</div>
            <div style={{fontSize:12,fontWeight:600,color:T.text,lineHeight:1.4,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div>
          </div>
        )}

        {NAV.map(n=>{
          const active=page===n.id;
          const cnt = n.id==="rankings"?counts.candidates
            : n.id==="shortlisted"?counts.shortlisted
            : n.id==="rejected"?counts.rejected:null;
          return(
            <div key={n.id} onClick={()=>setPage(n.id)} style={{
              display:"flex",alignItems:"center",gap:10,
              padding:"9px 12px",borderRadius:8,marginBottom:2,
              cursor:"pointer",userSelect:"none",
              background:active?T.accentLight:"transparent",
              color:active?T.accent:T.textSub,
              fontSize:13,fontWeight:active?600:400,
              transition:"all .14s",
              borderLeft:active?`2px solid ${T.accent}`:"2px solid transparent",
            }}
            onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T.bgAlt;}}
            onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:14,width:18,textAlign:"center"}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {cnt>0&&(
                <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,
                  background:active?`${T.accent}20`:`${T.emerald}15`,
                  color:active?T.accent:T.emerald,fontFamily:T.mono}}>{cnt}</span>
              )}
            </div>
          );
        })}

        {/* Active Jobs section */}
        {jobs.length>0&&(
          <div style={{marginTop:16}}>
            <div style={{height:1,background:T.border,margin:"0 4px 12px"}}/>
            <div onClick={()=>setJobsExpanded(x=>!x)}
              style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"4px 12px 6px",cursor:"pointer",userSelect:"none"}}>
              <span style={{fontSize:10,fontWeight:700,color:T.textLight,
                letterSpacing:".08em",textTransform:"uppercase"}}>Jobs</span>
              <span style={{fontSize:10,color:T.textLight,
                display:"inline-block",transform:jobsExpanded?"rotate(0)":"rotate(-90deg)",
                transition:"transform .2s"}}>▾</span>
            </div>
            {jobsExpanded&&(
              <div style={{display:"grid",gap:2}}>
                {jobs.map(j=>{
                  const isActive=j.jobId===job.jobId;
                  return(
                    <div key={j.jobId} onClick={()=>onSelectJob&&onSelectJob(j.jobId)}
                      style={{display:"flex",alignItems:"center",gap:9,
                        padding:"8px 12px",borderRadius:8,cursor:"pointer",userSelect:"none",
                        background:isActive?T.accentLight:"transparent",
                        borderLeft:isActive?`2px solid ${T.accent}`:"2px solid transparent",
                        transition:"all .14s"}}
                      onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=T.bgAlt;}}
                      onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background="transparent";}}>
                      <span style={{fontSize:12,color:isActive?T.accent:T.textLight,flexShrink:0}}>✦</span>
                      <span style={{fontSize:12,fontWeight:isActive?600:400,
                        color:isActive?T.accent:T.textSub,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                        flex:1,lineHeight:1.4}}>{j.title}</span>
                      {j.candidates&&j.candidates.length>0&&(
                        <span style={{fontSize:10,fontWeight:600,padding:"1px 5px",borderRadius:10,
                          background:T.secondaryLight,color:T.secondary,fontFamily:T.mono,flexShrink:0}}>
                          {j.candidates.length}
                        </span>
                      )}
                    </div>
                  );
                })}
                {isRecruiter&&(
                  <div onClick={onNewJob}
                    style={{display:"flex",alignItems:"center",gap:9,
                      padding:"7px 12px",borderRadius:8,cursor:"pointer",userSelect:"none",
                      transition:"background .14s",borderLeft:"2px solid transparent"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.bgAlt}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:14,color:T.accent}}>+</span>
                    <span style={{fontSize:12,color:T.textSub,fontWeight:500}}>New Job</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div onClick={onProfileClick}
        style={{padding:"12px 14px",borderTop:`1px solid ${T.border}`,
          cursor:"pointer",transition:"background .14s"}}
        onMouseEnter={e=>e.currentTarget.style.background=T.bgAlt}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
            background:T.gradPrimary,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:800,color:"#fff"}}>
            {(currentUser?.name||"R").charAt(0).toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,overflow:"hidden",
              textOverflow:"ellipsis",whiteSpace:"nowrap",color:T.text}}>{currentUser?.name||"User"}</div>
            <div style={{fontSize:10,color:T.textMuted,textTransform:"capitalize"}}>{currentUser?.role||"recruiter"}</div>
          </div>
          <span style={{fontSize:12,color:T.textLight}}>⚙</span>
        </div>
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
════════════════════════════════════════════════════════════════════════════ */
function DashboardPage({job,candidates,setPage,onNewJob,jobCount,currentUser,company}){
  const role = currentUser?.role||"recruiter";
  const isRecruiter = role==="recruiter";
  const avg=candidates.length?Math.round(candidates.reduce((a,c)=>a+c.matchScore,0)/candidates.length):0;
  const top=[...candidates].sort((a,b)=>b.matchScore-a.matchScore).slice(0,5);
  const shortlisted=candidates.filter(c=>c.status==="shortlisted");
  const rejected=candidates.filter(c=>c.status==="rejected");

  const stats=isRecruiter?[
    {label:"Active Jobs",val:jobCount||0,color:T.accent,bg:T.accentLight,icon:"✦",sub:"Total positions"},
    {label:"Candidates",val:candidates.length,color:T.secondary,bg:T.secondaryLight,icon:"👤",sub:"Uploaded resumes"},
    {label:"Avg Match Score",val:avg?`${avg}%`:"—",color:T.emerald,bg:T.emeraldLight,icon:"◎",sub:"Across all"},
    {label:"Top Tier ≥80%",val:candidates.filter(c=>c.matchScore>=80).length,color:T.amber,bg:T.amberLight,icon:"★",sub:"Excellent matches"},
  ]:[
    {label:"Total Candidates",val:candidates.length,color:T.secondary,bg:T.secondaryLight,icon:"👤",sub:"Across active jobs"},
    {label:"Shortlisted",val:shortlisted.length,color:T.emerald,bg:T.emeraldLight,icon:"✅",sub:"Ready to interview"},
    {label:"Rejected",val:rejected.length,color:T.rose,bg:T.roseLight,icon:"❌",sub:"Not a fit"},
    {label:"Pending Review",val:candidates.filter(c=>!c.status||c.status==="applied").length,color:T.amber,bg:T.amberLight,icon:"⏳",sub:"Awaiting decision"},
  ];

  return(
    <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}} className="fu">
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
        <div>
          <h1 style={{fontFamily:T.display,fontSize:24,fontWeight:800,color:T.text,lineHeight:1,marginBottom:4}}>
            Good morning, {currentUser?.name?.split(" ")[0]||"there"} 👋
          </h1>
          <p style={{color:T.textMuted,fontSize:13}}>
            {company?.companyName} · {isRecruiter?"Recruiter Dashboard":"Hiring Manager Portal"}
          </p>
        </div>
        {isRecruiter&&<Btn variant="gradient" icon="+" onClick={onNewJob}>New Job</Btn>}
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        {stats.map((s,i)=>(
          <div key={s.label} style={{background:T.surface,border:`1px solid ${T.border}`,
            borderRadius:12,padding:"20px 22px",boxShadow:T.shadow,
            position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-16,right:-16,width:72,height:72,
              borderRadius:"50%",background:s.bg,opacity:.7}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:11,color:T.textMuted,fontWeight:600,marginBottom:8,textTransform:"uppercase",letterSpacing:".05em"}}>{s.label}</div>
                <div style={{fontSize:30,fontWeight:800,color:s.color,fontFamily:T.mono,lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:11,color:T.textLight,marginTop:5}}>{s.sub}</div>
              </div>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,
                color:s.color,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:16,border:`1px solid ${s.color}20`,flexShrink:0}}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>
        {/* Top Candidates */}
        <Card style={{padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h3 style={{fontSize:15,fontWeight:700,color:T.text}}>Top Candidates</h3>
            <Btn variant="ghost" small onClick={()=>setPage("rankings")}>View all →</Btn>
          </div>
          {top.length===0&&(
            <div style={{textAlign:"center",padding:"32px 0",color:T.textMuted,fontSize:13}}>
              <div style={{fontSize:36,marginBottom:12}}>📭</div>
              No candidates yet. Upload resumes to start.
            </div>
          )}
          {top.map((c,i)=>{
            const sc=STATUS_CONFIG[c.status||"applied"];
            return(
              <div key={c.id||i} style={{display:"flex",alignItems:"center",gap:14,
                padding:"12px 0",borderBottom:i<top.length-1?`1px solid ${T.border}`:"none"}}>
                <div style={{width:26,fontSize:14,textAlign:"center",color:T.textMuted,fontFamily:T.mono,fontWeight:700}}>
                  {["🥇","🥈","🥉"][i]||`#${i+1}`}
                </div>
                <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
                  background:T.gradPrimary,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:13,fontWeight:800,color:"#fff"}}>{c.name?.charAt(0)||"?"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{c.name}</div>
                  <div style={{fontSize:11,color:T.textMuted}}>{c.title}</div>
                </div>
                <Badge color={sc.color} bg={sc.bg}>{sc.label}</Badge>
                <ScoreRing score={c.matchScore} size={42}/>
              </div>
            );
          })}
        </Card>

        {/* Score distribution */}
        <Card style={{padding:24}}>
          <h3 style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:20}}>Score Distribution</h3>
          {[
            {label:"Excellent ≥ 80%",min:80,max:101,color:T.emerald},
            {label:"Good 60–79%",min:60,max:80,color:T.amber},
            {label:"Fair 40–59%",min:40,max:60,color:"#F97316"},
            {label:"Poor < 40%",min:0,max:40,color:T.rose},
          ].map(tier=>{
            const cnt=candidates.filter(c=>c.matchScore>=tier.min&&c.matchScore<tier.max).length;
            const pct=candidates.length?Math.round((cnt/candidates.length)*100):0;
            return(
              <div key={tier.label} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:T.textSub}}>{tier.label}</span>
                  <span style={{fontSize:12,fontFamily:T.mono,color:tier.color,fontWeight:600}}>{cnt}</span>
                </div>
                <ProgressBar pct={pct} color={tier.color}/>
              </div>
            );
          })}
          {!job.title&&isRecruiter&&(
            <div style={{marginTop:18,padding:14,borderRadius:10,
              background:T.accentLight,border:`1px solid ${T.borderHi}`,textAlign:"center"}}>
              <div style={{fontSize:12,color:T.accent,marginBottom:8}}>No job configured</div>
              <Btn small variant="outline" onClick={()=>setPage("job")}>Setup Job →</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   JOB SETUP PAGE
════════════════════════════════════════════════════════════════════════════ */
function JobPage({job,setJob,setPage}){
  const [f,setF]=useState(job.title?job:{title:"",description:"",skills:"",experience:"",education:"",preferences:""});
  const [saved,setSaved]=useState(false);
  useEffect(()=>{
    setF(job.title?job:{title:"",description:"",skills:"",experience:"",education:"",preferences:""});
  },[job.jobId]);

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
    <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}} className="fu">
      <div style={{maxWidth:700}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
          <div>
            <h1 style={{fontFamily:T.display,fontSize:24,fontWeight:800,color:T.text,marginBottom:4}}>Job Setup</h1>
            <p style={{color:T.textMuted,fontSize:13}}>Define the role so AI can match candidates accurately</p>
          </div>
          <Btn variant="secondary" small onClick={loadExample} icon="✦">Load Example</Btn>
        </div>
        <Card style={{padding:32}}>
          <div style={{display:"grid",gap:20}}>
            <Input label="Job Title" value={f.title} onChange={v=>setF(x=>({...x,title:v}))}
              placeholder="e.g. Senior Full-Stack Engineer" required/>
            <Input label="Job Description" value={f.description} onChange={v=>setF(x=>({...x,description:v}))}
              placeholder="Describe the role, responsibilities, and success criteria..." multiline rows={5} required/>
            <Input label="Required Skills" value={f.skills} onChange={v=>setF(x=>({...x,skills:v}))}
              placeholder="React, TypeScript, Node.js, AWS, PostgreSQL..." required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Input label="Experience Requirements" value={f.experience} onChange={v=>setF(x=>({...x,experience:v}))}
                placeholder="5+ years professional experience" required/>
              <Input label="Education Requirements" value={f.education} onChange={v=>setF(x=>({...x,education:v}))}
                placeholder="Bachelor's in CS or equivalent"/>
            </div>
            <Input label="Preferred Qualifications (Optional)" value={f.preferences}
              onChange={v=>setF(x=>({...x,preferences:v}))}
              placeholder="Open source contributions, startup experience..."/>
          </div>
          <div style={{display:"flex",gap:12,marginTop:28,paddingTop:22,borderTop:`1px solid ${T.border}`}}>
            <Btn onClick={save} disabled={!f.title||!f.description} variant="gradient">
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
   UPLOAD PAGE
════════════════════════════════════════════════════════════════════════════ */
function UploadPage({job,candidates,setCandidates,onCandidateAdded}){
  const [queue,setQueue]=useState([]);
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
      setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"extracting"}:x));
      let text="";
      try{ text=await extractText(item.file); }
      catch(e){
        setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"error",error:"Could not read file: "+e.message}:x));
        continue;
      }
      setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"analyzing"}:x));
      try{
        const result=await analyzeResume(text,job.title,job.description,job.skills,job.experience,job.education);
        result.id=item.id;
        result.fileName=item.file.name;
        result.status="applied";
        setQueue(q=>q.map(x=>x.id===item.id?{...x,status:"done",result}:x));
        setCandidates(prev=>{
          const filtered=prev.filter(c=>c.id!==item.id);
          return [...filtered,result];
        });
        if(onCandidateAdded) onCandidateAdded(result);
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
  const statusColor={queued:T.textMuted,extracting:T.amber,analyzing:T.accent,done:T.emerald,error:T.rose};

  return(
    <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}} className="fu">
      <div style={{maxWidth:760}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:T.display,fontSize:24,fontWeight:800,color:T.text,marginBottom:4}}>Upload Resumes</h1>
          <p style={{color:T.textMuted,fontSize:13}}>
            {job.title
              ?<>Analyzing for: <span style={{color:T.accent,fontWeight:600}}>{job.title}</span></>
              :<span style={{color:T.rose}}>⚠ No job configured — set up a job first</span>
            }
          </p>
        </div>

        <div
          onDragOver={e=>{e.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={onDrop}
          onClick={()=>!processing&&inputRef.current?.click()}
          style={{border:`2px dashed ${dragging?T.accent:T.border}`,borderRadius:14,
            padding:"44px 36px",textAlign:"center",
            cursor:processing?"default":"pointer",
            background:dragging?T.accentLight:T.surface,
            transition:"all .18s",marginBottom:20,
            boxShadow:dragging?`0 0 0 4px ${T.accentGlow}`:"none"}}>
          <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.doc"
            onChange={e=>addFiles(e.target.files)} style={{display:"none"}}/>
          <div style={{fontSize:40,marginBottom:12}}>📂</div>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:6}}>
            {dragging?"Drop to add resumes":"Drag & drop resumes here"}
          </div>
          <div style={{color:T.textMuted,fontSize:13,marginBottom:18}}>
            PDF and DOCX supported · Multiple files at once
          </div>
          <Btn variant="secondary" small onClick={e=>{e.stopPropagation();inputRef.current?.click();}} icon="↑">
            Browse Files
          </Btn>
        </div>

        {queue.length>0&&(
          <Card style={{padding:22,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontSize:14,fontWeight:700,color:T.text}}>
                {queue.length} resume{queue.length!==1?"s":""} · {done.length} done
                {errors.length>0&&<span style={{color:T.rose,marginLeft:8}}> · {errors.length} failed</span>}
              </h3>
              <div style={{display:"flex",gap:8}}>
                {done.length>0&&<Btn variant="ghost" small onClick={clearDone}>Clear done</Btn>}
                {pending.length>0&&!processing&&<Btn small onClick={processAll} disabled={!job.title} icon="🧠" variant="gradient">
                  Analyze {pending.length} Resume{pending.length!==1?"s":""}
                </Btn>}
              </div>
            </div>
            <div style={{display:"grid",gap:8}}>
              {queue.map(item=>(
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,
                  padding:"10px 13px",borderRadius:9,
                  background:item.status==="done"?T.emeraldLight:item.status==="error"?T.roseLight:T.bgAlt,
                  border:`1px solid ${item.status==="done"?"#A7F3D0":item.status==="error"?"#FECACA":T.border}`}}>
                  {(item.status==="extracting"||item.status==="analyzing")
                    ?<Spinner size={15} color={statusColor[item.status]}/>
                    :<span style={{fontSize:13,color:statusColor[item.status],fontWeight:700,width:15,textAlign:"center"}}>
                      {item.status==="queued"?"○":item.status==="done"?"✓":"✗"}
                    </span>
                  }
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:T.text}}>
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
                      color:T.textMuted,cursor:"pointer",fontSize:18,padding:"0 4px",lineHeight:1}}>×</button>
                  )}
                </div>
              ))}
            </div>
            {processing&&(
              <div style={{marginTop:16}}>
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

        {queue.length===0&&(
          <Card style={{padding:24}}>
            <div style={{fontSize:12,fontWeight:700,color:T.textSub,letterSpacing:".06em",
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
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{s.label}</div>
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
   RANKINGS PAGE
════════════════════════════════════════════════════════════════════════════ */
function RankingsPage({candidates,job,onSelect,filterStatus,currentUser}){
  const [sort,setSort]=useState("score");
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [showExport,setShowExport]=useState(false);
  const role = currentUser?.role||"recruiter";

  const source = filterStatus
    ? candidates.filter(c=>c.status===filterStatus)
    : candidates;

  const sorted=[...source].sort((a,b)=>
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

  const title = filterStatus==="shortlisted"?"Shortlisted Candidates"
    : filterStatus==="rejected"?"Rejected Candidates"
    : "Candidate Rankings";

  return(
    <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}} className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,flexWrap:"wrap",gap:14}}>
        <div>
          <h1 style={{fontFamily:T.display,fontSize:24,fontWeight:800,color:T.text,marginBottom:4}}>{title}</h1>
          <p style={{color:T.textMuted,fontSize:13}}>
            {job.title?<>For: <span style={{color:T.accent,fontWeight:600}}>{job.title}</span> · </>:""}
            {sorted.length} of {source.length} shown
          </p>
        </div>
        {role==="recruiter"&&(
          <div style={{display:"flex",gap:10,position:"relative"}}>
            <Btn variant="secondary" small icon="↓" onClick={()=>setShowExport(x=>!x)}>Export</Btn>
            {showExport&&(
              <div style={{position:"absolute",top:"110%",right:0,background:T.surface,
                border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",zIndex:50,
                minWidth:160,boxShadow:T.shadowLg}}>
                <button onClick={()=>{exportCSV(sorted);setShowExport(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 16px",
                    background:"none",border:"none",color:T.text,cursor:"pointer",fontSize:13,
                    fontFamily:T.sans,textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bgAlt}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  📄 Download CSV
                </button>
                <button onClick={()=>{exportExcel(sorted);setShowExport(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 16px",
                    background:"none",border:"none",color:T.text,cursor:"pointer",fontSize:13,
                    fontFamily:T.sans,textAlign:"left"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bgAlt}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  📊 Download Excel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
              color:T.textMuted,fontSize:14}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search name or skill…"
              style={{width:"100%",padding:"9px 13px 9px 36px",background:T.surface,
                border:`1.5px solid ${T.border}`,borderRadius:8,color:T.text,
                fontSize:13,fontFamily:T.sans,outline:"none"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["all","excellent","good","fair"].map(fv=>(
            <button key={fv} onClick={()=>setFilter(fv)} style={{
              padding:"8px 13px",borderRadius:8,fontSize:11,fontWeight:600,
              cursor:"pointer",transition:"all .13s",
              background:filter===fv?T.accent:T.surface,
              color:filter===fv?"#fff":T.textSub,
              border:`1px solid ${filter===fv?T.accent:T.border}`,
              fontFamily:T.sans,textTransform:"capitalize"}}>
              {fv}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{padding:"9px 12px",background:T.surface,border:`1px solid ${T.border}`,
            borderRadius:8,color:T.text,fontSize:13,outline:"none",cursor:"pointer",fontFamily:T.sans}}>
          <option value="score">Sort: Match Score</option>
          <option value="exp">Sort: Experience</option>
          <option value="name">Sort: Name A–Z</option>
        </select>
      </div>

      {source.length===0&&(
        <div style={{textAlign:"center",padding:"64px 0",color:T.textMuted}}>
          <div style={{fontSize:48,marginBottom:14}}>📭</div>
          <div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:6}}>No candidates here</div>
          <div style={{fontSize:13}}>
            {filterStatus==="shortlisted"?"No candidates have been shortlisted yet."
             :filterStatus==="rejected"?"No candidates have been rejected yet."
             :"Upload resumes and run AI analysis to populate rankings"}
          </div>
        </div>
      )}

      <div style={{display:"grid",gap:8}}>
        {sorted.map((c,i)=>{
          const rank=[...source].sort((a,b)=>b.matchScore-a.matchScore).indexOf(c)+1;
          const col=clr(c.matchScore);
          const sc=STATUS_CONFIG[c.status||"applied"];
          return(
            <Card key={c.id} onClick={()=>onSelect(c)} style={{overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"stretch"}}>
                <div style={{width:52,flexShrink:0,
                  background:rank<=3?`${["#FEF3C7","#F1F5F9","#FEF3C7"][rank-1]}`:T.bgAlt,
                  borderRight:`1px solid ${T.border}`,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  fontSize:rank<=3?18:12,
                  color:rank<=3?["#D97706","#94A3B8","#B45309"][rank-1]:T.textMuted,
                  fontWeight:700,fontFamily:T.mono}}>
                  {["🥇","🥈","🥉"][rank-1]||`#${rank}`}
                </div>
                <div style={{flex:1,padding:"16px 20px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  <div style={{width:42,height:42,borderRadius:"50%",flexShrink:0,
                    background:T.gradPrimary,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,fontWeight:800,color:"#fff"}}>
                    {c.name?.charAt(0)||"?"}
                  </div>
                  <div style={{flex:1,minWidth:130}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span style={{fontSize:14,fontWeight:700,color:T.text}}>{c.name||"Unknown"}</span>
                      <Badge color={sc.color} bg={sc.bg}>{sc.label}</Badge>
                      {(c.redFlags||[]).length===0
                        ?<Badge color={T.emerald} bg={T.emeraldLight}>Clean</Badge>
                        :<Badge color={T.rose} bg={T.roseLight}>{c.redFlags.length} flag{c.redFlags.length>1?"s":""}</Badge>
                      }
                    </div>
                    <div style={{fontSize:12,color:T.textMuted,marginBottom:8}}>
                      {c.title||"—"} · {c.yearsExperience||0}y exp
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {(c.skills||[]).slice(0,4).map(s=>(
                        <span key={s} style={{padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:500,
                          background:T.accentLight,color:T.accent,border:`1px solid ${T.borderHi}`}}>{s}</span>
                      ))}
                      {(c.skills||[]).length>4&&(
                        <span style={{fontSize:11,color:T.textMuted,padding:"2px 4px"}}>+{(c.skills||[]).length-4} more</span>
                      )}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <ScoreRing score={c.matchScore} size={62}/>
                    <Badge color={col} bg={clrBg(c.matchScore)} style={{fontSize:10}}>{scoreLabel(c.matchScore)}</Badge>
                  </div>
                  <span style={{color:T.textLight,fontSize:18}}>›</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sorted.length===0&&source.length>0&&(
        <div style={{textAlign:"center",padding:"36px 0",color:T.textMuted,fontSize:13}}>
          No candidates match your filters
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   EMAIL COMPOSER
════════════════════════════════════════════════════════════════════════════ */
function EmailComposer({candidate,job,currentUser,type,onClose,company}){
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState(false);

  const isShortlist = type==="shortlist";
  const companyName=company?.companyName||currentUser?.companyName||"Our Company";
  const subject = isShortlist
    ? `You've been shortlisted — ${job.title||"Position"} at ${companyName}`
    : `Your application for ${job.title||"the position"} at ${companyName}`;

  const generate=async()=>{
    setLoading(true);
    const emailType = isShortlist?"shortlisting":"rejection";
    const prompt=`Generate a professional ${emailType} email for a job candidate.

Use ONLY the following data — do not invent any details:
- Candidate Name: ${candidate.name}
- Job Title: ${job.title||"the position"}
- Company: ${companyName}
- Sender Name: ${currentUser?.name||"The Hiring Team"}
- Sender Role: ${currentUser?.role==="manager"?"Hiring Manager":"Recruiter"}

${isShortlist
  ? `This is a SHORTLISTING email. The candidate has been selected to proceed.
     Mention: congratulations, next steps (interview), ask them to reply to confirm availability.`
  : `This is a REJECTION email. The candidate was not selected.
     Be polite, professional, and empathetic. Do NOT give specific reasons.
     Wish them well in their job search.`
}

Return ONLY the email body text (no subject line, no JSON, no markdown).
Start with "Dear ${candidate.name}," and end with a proper sign-off.`;

    try{
      const raw=await callAI(prompt);
      setEmail(raw.trim());
    }catch(e){ setEmail("Failed to generate email. Please try again."); }
    setLoading(false);
  };

  const openGmail=()=>{
    const MISSING = "This detail is not found in the resume";
    const to = (candidate.email && candidate.email!==MISSING) ? candidate.email : "";
    const params=new URLSearchParams({
      view:"cm",fs:"1",
      ...(to?{to}:{}),
      su:subject,
      body:email,
    });
    window.open(`https://mail.google.com/mail/?${params.toString()}`,"_blank");
  };

  const copyEmail=async()=>{
    try{ await navigator.clipboard.writeText(email); setCopied(true); setTimeout(()=>setCopied(false),2000); }
    catch{}
  };

  useEffect(()=>{ generate(); },[]);

  const MISSING = "This detail is not found in the resume";
  const emailMissing = !candidate.email || candidate.email===MISSING;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:1000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:T.surface,borderRadius:16,padding:28,maxWidth:600,width:"100%",
        border:`1px solid ${T.border}`,boxShadow:T.shadowXl}} className="fu">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:isShortlist?T.emerald:T.rose,
              letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>
              {isShortlist?"Shortlist Email":"Rejection Email"}
            </div>
            <h3 style={{fontSize:17,fontWeight:700,color:T.text}}>Email to {candidate.name}</h3>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.textMuted,
            cursor:"pointer",fontSize:22,lineHeight:1,padding:4}}>×</button>
        </div>

        {emailMissing&&(
          <div style={{padding:"10px 13px",borderRadius:8,marginBottom:14,
            background:T.amberLight,border:`1px solid #FDE68A`,fontSize:12,color:"#B45309"}}>
            ⚠ Email not found in resume. Add the recipient manually in Gmail.
          </div>
        )}

        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.textMuted,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>To</div>
          <div style={{padding:"8px 12px",background:T.bgAlt,borderRadius:7,fontSize:13,
            color:emailMissing?"#B45309":T.textSub,border:`1px solid ${T.border}`}}>
            {emailMissing?"[No email found — add manually in Gmail]":candidate.email}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:T.textMuted,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>Subject</div>
          <div style={{padding:"8px 12px",background:T.bgAlt,borderRadius:7,fontSize:13,color:T.textSub,border:`1px solid ${T.border}`}}>
            {subject}
          </div>
        </div>

        <div style={{marginBottom:18}}>
          <div style={{fontSize:11,color:T.textMuted,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>Email Body</div>
          {loading
            ?<div style={{padding:"28px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                background:T.bgAlt,borderRadius:9,border:`1px solid ${T.border}`}}>
                <Spinner size={16}/><span style={{fontSize:13,color:T.textSub}}>Generating email…</span>
              </div>
            :<textarea value={email} onChange={e=>setEmail(e.target.value)} rows={9}
                style={{width:"100%",padding:"12px",background:T.bgAlt,
                  border:`1px solid ${T.border}`,borderRadius:9,color:T.text,
                  fontSize:13,fontFamily:T.sans,outline:"none",resize:"vertical",lineHeight:1.7}}/>
          }
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Btn variant={isShortlist?"success":"danger"} onClick={openGmail} disabled={loading} icon="✉">
            Send via Gmail
          </Btn>
          <Btn variant="secondary" onClick={generate} disabled={loading} icon="↻">
            {loading?<><Spinner size={13}/> Generating…</>:"Regenerate"}
          </Btn>
          <Btn variant="ghost" onClick={copyEmail} disabled={loading||!email}>
            {copied?"✓ Copied!":"Copy Email"}
          </Btn>
          <Btn variant="ghost" onClick={onClose} style={{marginLeft:"auto"}}>Close</Btn>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   CANDIDATE DETAIL PAGE
════════════════════════════════════════════════════════════════════════════ */
function DetailPage({candidate:c,job,onBack,onStatusChange,currentUser,company}){
  const [tab,setTab]=useState("overview");
  const [regenLoading,setRegenLoading]=useState(false);
  const [questions,setQuestions]=useState(c.interviewQuestions||[]);
  const [emailModal,setEmailModal]=useState(null);
  const [localStatus,setLocalStatus]=useState(c.status||"applied");

  const col=clr(c.matchScore);
  const jobSkillsList=(job.skills||"").split(",").map(s=>s.trim()).filter(Boolean);
  const matched=c.matchedSkills||[];
  const missing=c.missingSkills||[];

  const setStatus=(newStatus)=>{
    setLocalStatus(newStatus);
    if(onStatusChange) onStatusChange(c.id, newStatus);
  };

  const regenQuestions=async()=>{
    setRegenLoading(true);
    try{
      const raw=await callAI(
        `Generate 5 tailored interview questions for ${c.name}, a ${c.title} with ${c.yearsExperience} years experience applying for ${job.title}. \nTheir skills: ${(c.skills||[]).join(", ")}. Missing: ${(c.missingSkills||[]).join(", ")||"none"}. Red flags: ${(c.redFlags||[]).join(", ")||"none"}.\nReturn ONLY a JSON array of 5 question strings, no markdown, no explanation.`
      );
      const clean=raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
      const m=clean.match(/\[[\s\S]*\]/);
      if(m) setQuestions(JSON.parse(m[0]));
    }catch(e){ console.error("Regen failed:",e.message); }
    setRegenLoading(false);
  };

  const TABS=["Overview","Skills","Experience","Interview","Gap Analysis"];
  const sc=STATUS_CONFIG[localStatus];

  return(
    <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}} className="si">
      {emailModal&&(
        <EmailComposer
          candidate={{...c,status:localStatus}}
          job={job}
          currentUser={currentUser}
          company={company}
          type={emailModal}
          onClose={()=>setEmailModal(null)}
        />
      )}

      <button onClick={onBack} style={{background:"none",border:"none",color:T.textSub,
        cursor:"pointer",fontSize:13,marginBottom:22,display:"flex",alignItems:"center",gap:6,
        fontFamily:T.sans}}>← Back to Rankings</button>

      {/* Header card */}
      <Card style={{padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:300,height:220,
          background:`radial-gradient(circle at top right,${col}10,transparent)`,pointerEvents:"none"}}/>
        <div style={{display:"flex",gap:22,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{width:72,height:72,borderRadius:16,flexShrink:0,
            background:T.gradPrimary,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:28,fontWeight:900,color:"#fff"}}>
            {c.name?.charAt(0)||"?"}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
              <h1 style={{fontFamily:T.display,fontSize:24,fontWeight:800,color:T.text}}>{c.name}</h1>
              <Badge color={col} bg={clrBg(c.matchScore)}>{scoreLabel(c.matchScore)} Match</Badge>
              <Badge color={sc.color} bg={sc.bg} dot>{sc.label}</Badge>
              {(c.redFlags||[]).length>0&&<Badge color={T.rose} bg={T.roseLight} dot>{c.redFlags.length} Red Flag{c.redFlags.length>1?"s":""}</Badge>}
            </div>
            <div style={{fontSize:13,color:T.textMuted,marginBottom:10}}>
              {c.title} · {c.yearsExperience||0} years experience
            </div>
            <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:14}}>
              {c.email&&c.email!=="This detail is not found in the resume"&&<span style={{fontSize:12,color:T.textSub}}>✉ {c.email}</span>}
              {c.phone&&c.phone!=="This detail is not found in the resume"&&<span style={{fontSize:12,color:T.textSub}}>📞 {c.phone}</span>}
              {c.fileName&&<span style={{fontSize:12,color:T.textSub}}>📄 {c.fileName}</span>}
            </div>
            <div style={{marginBottom:14}}>
              <PipelineTracker status={localStatus}/>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <Btn variant="success" small
                disabled={localStatus==="shortlisted"}
                onClick={()=>setStatus("shortlisted")} icon="✅">
                {localStatus==="shortlisted"?"✓ Shortlisted":"Shortlist"}
              </Btn>
              <Btn variant="danger" small
                disabled={localStatus==="rejected"}
                onClick={()=>setStatus("rejected")} icon="❌">
                {localStatus==="rejected"?"✗ Rejected":"Reject"}
              </Btn>
              <Btn variant="secondary" small onClick={()=>setEmailModal("shortlist")} icon="✉">Shortlist Email</Btn>
              <Btn variant="secondary" small onClick={()=>setEmailModal("reject")} icon="✉">Rejection Email</Btn>
            </div>
          </div>
          <ScoreRing score={c.matchScore} size={86}/>
        </div>

        {c.summary&&(
          <div style={{marginTop:20,padding:"14px 18px",borderRadius:10,
            background:T.accentLight,border:`1px solid ${T.borderHi}`}}>
            <div style={{fontSize:10,color:T.accent,fontWeight:700,letterSpacing:".08em",
              textTransform:"uppercase",marginBottom:6}}>AI Summary</div>
            <p style={{fontSize:13,color:T.textSub,lineHeight:1.8,margin:0}}>{c.summary}</p>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1.5px solid ${T.border}`,background:T.surface,borderRadius:"10px 10px 0 0",padding:"0 4px"}}>
        {TABS.map(t=>{
          const key=t.toLowerCase().replace(" ","_");
          const active=tab===key;
          return(
            <button key={t} onClick={()=>setTab(key)}
              style={{background:"none",border:"none",cursor:"pointer",
                padding:"10px 16px",fontSize:12,fontWeight:active?700:500,
                color:active?T.accent:T.textMuted,
                borderBottom:`2px solid ${active?T.accent:"transparent"}`,
                fontFamily:T.sans,transition:"all .13s",marginBottom:-1.5}}>
              {t}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}} className="fi">
          <Card style={{padding:24}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Education</h3>
            <div style={{padding:12,background:T.bgAlt,borderRadius:9,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>{(c.education||"—").split("—")[0]}</div>
              <div style={{fontSize:12,color:T.textMuted}}>{(c.education||"").split("—")[1]?.trim()}</div>
            </div>
            {(c.certifications||[]).length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:T.textSub,letterSpacing:".05em",
                  textTransform:"uppercase",marginBottom:10}}>Certifications</div>
                {c.certifications.map(cert=>(
                  <div key={cert} style={{display:"flex",alignItems:"center",gap:10,
                    padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{color:T.amber}}>🏆</span>
                    <span style={{fontSize:12,color:T.textSub}}>{cert}</span>
                  </div>
                ))}
              </>
            )}
          </Card>
          <Card style={{padding:24}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Projects</h3>
            {(c.projects||[]).length===0
              ?<div style={{fontSize:13,color:T.textMuted}}>No projects listed</div>
              :c.projects.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"9px 0",
                  borderBottom:i<c.projects.length-1?`1px solid ${T.border}`:"none"}}>
                  <span style={{color:T.accent,flexShrink:0}}>▸</span>
                  <span style={{fontSize:12,color:T.textSub,lineHeight:1.65}}>{p}</span>
                </div>
              ))
            }
            {(c.redFlags||[]).length>0&&(
              <div style={{marginTop:18,padding:12,borderRadius:9,
                background:T.roseLight,border:`1px solid #FECACA`}}>
                <div style={{fontSize:10,color:T.rose,fontWeight:700,letterSpacing:".06em",
                  textTransform:"uppercase",marginBottom:8}}>⚠ Red Flags</div>
                {c.redFlags.map((f,i)=>(
                  <div key={i} style={{fontSize:12,color:T.rose,padding:"2px 0"}}>• {f}</div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Skills */}
      {tab==="skills"&&(
        <div style={{display:"grid",gap:18}} className="fi">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <Card style={{padding:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>✓ Matched Skills</h3>
              <p style={{fontSize:12,color:T.textMuted,marginBottom:14}}>{matched.length} of {jobSkillsList.length||"?"} required</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {matched.length===0
                  ?<span style={{fontSize:13,color:T.textMuted}}>None matched</span>
                  :matched.map(s=>(
                    <span key={s} style={{display:"inline-flex",alignItems:"center",gap:5,
                      padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:500,
                      background:T.emeraldLight,color:T.emerald,border:`1px solid #A7F3D0`}}>
                      ✓ {s}
                    </span>
                  ))
                }
              </div>
            </Card>
            <Card style={{padding:24}}>
              <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:4}}>✗ Missing Skills</h3>
              <p style={{fontSize:12,color:T.textMuted,marginBottom:14}}>{missing.length} skill{missing.length!==1?"s":""} not found</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {missing.length===0
                  ?<span style={{fontSize:13,color:T.emerald,fontWeight:600}}>✓ All skills matched!</span>
                  :missing.map(s=>(
                    <span key={s} style={{display:"inline-flex",alignItems:"center",gap:5,
                      padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:500,
                      background:T.roseLight,color:T.rose,border:`1px solid #FECACA`}}>
                      ✗ {s}
                    </span>
                  ))
                }
              </div>
            </Card>
          </div>
          <Card style={{padding:24}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>All Candidate Skills</h3>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {(c.skills||[]).map(s=>(
                <span key={s} style={{padding:"4px 10px",borderRadius:6,fontSize:12,fontWeight:500,
                  background:T.accentLight,color:T.accent,border:`1px solid ${T.borderHi}`}}>{s}</span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Experience */}
      {tab==="experience"&&(
        <Card style={{padding:24}} className="fi">
          <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:18}}>Work History</h3>
          {(c.workHistory||[]).length===0
            ?<div style={{fontSize:13,color:T.textMuted}}>No work history extracted</div>
            :(c.workHistory||[]).map((w,i)=>(
              <div key={i} style={{display:"flex",gap:14,padding:"14px 0",
                borderBottom:i<c.workHistory.length-1?`1px solid ${T.border}`:"none"}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:T.accent,
                  marginTop:4,flexShrink:0,border:`2px solid ${T.borderHi}`}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{w.split(":")[0]}</div>
                  {w.includes(":")&&(
                    <div style={{fontSize:12,color:T.textSub,lineHeight:1.65}}>{w.split(":").slice(1).join(":")}</div>
                  )}
                </div>
              </div>
            ))
          }
        </Card>
      )}

      {/* Interview */}
      {tab==="interview"&&(
        <div className="fi">
          <Card style={{padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:3}}>Interview Questions</h3>
                <p style={{fontSize:12,color:T.textMuted}}>AI-generated, tailored to {c.name}'s profile</p>
              </div>
              <Btn variant="secondary" small onClick={regenQuestions} disabled={regenLoading}>
                {regenLoading?<><Spinner size={13}/> Generating…</>:"✦ Regenerate"}
              </Btn>
            </div>
            <div style={{display:"grid",gap:10}}>
              {(questions||[]).map((q,i)=>(
                <div key={i} style={{display:"flex",gap:13,padding:"13px 15px",
                  borderRadius:10,background:T.bgAlt,border:`1px solid ${T.border}`}}>
                  <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                    background:T.accentLight,color:T.accent,display:"flex",
                    alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:T.mono}}>
                    {i+1}
                  </div>
                  <p style={{fontSize:13,color:T.textSub,lineHeight:1.75,margin:0}}>{q}</p>
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

      {/* Gap Analysis */}
      {tab==="gap_analysis"&&(
        <div style={{display:"grid",gap:18}} className="fi">
          <Card style={{padding:24}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:20}}>Score Breakdown</h3>
            <div style={{display:"grid",gap:16}}>
              {Object.entries(c.scoreBreakdown||{skills:0,experience:0,education:0,projects:0,certifications:0}).map(([k,v])=>(
                <ProgressBar key={k} pct={v} label={k.charAt(0).toUpperCase()+k.slice(1)} sub={v}
                  color={v>=80?T.emerald:v>=60?T.amber:v>=40?"#F97316":T.rose}/>
              ))}
            </div>
          </Card>
          <Card style={{padding:24}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>AI Gap Analysis</h3>
            <div style={{padding:"14px 18px",borderRadius:10,marginBottom:16,
              background:clrBg(c.matchScore),border:`1px solid ${col}25`}}>
              <p style={{fontSize:13,color:T.textSub,lineHeight:1.8,margin:0}}>{c.gapAnalysis||"No analysis available."}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{padding:14,borderRadius:9,background:T.emeraldLight,border:`1px solid #A7F3D0`}}>
                <div style={{fontSize:10,fontWeight:700,color:T.emerald,letterSpacing:".06em",
                  textTransform:"uppercase",marginBottom:10}}>Strengths</div>
                {matched.slice(0,5).map(s=>(
                  <div key={s} style={{fontSize:12,color:T.textSub,padding:"2px 0"}}>✓ {s}</div>
                ))}
                {matched.length===0&&<div style={{fontSize:12,color:T.textMuted}}>No matched skills</div>}
              </div>
              <div style={{padding:14,borderRadius:9,background:T.roseLight,border:`1px solid #FECACA`}}>
                <div style={{fontSize:10,fontWeight:700,color:T.rose,letterSpacing:".06em",
                  textTransform:"uppercase",marginBottom:10}}>To Develop</div>
                {missing.slice(0,5).map(s=>(
                  <div key={s} style={{fontSize:12,color:T.textSub,padding:"2px 0"}}>○ {s}</div>
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
   PROFILE PAGE
════════════════════════════════════════════════════════════════════════════ */
function ProfilePage({currentUser,company,onLogout,onCreateRole}){
  const [saved,setSaved]=useState(false);
  const [showCreateRole,setShowCreateRole]=useState(false);

  const handleRoleCreated=(updatedCo,roleAccount,roleType)=>{
    setShowCreateRole(false);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  if(showCreateRole){
    return(
      <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}}>
        <CreateRolePage
          company={company}
          onRoleCreated={handleRoleCreated}
          onSkip={()=>setShowCreateRole(false)}
        />
      </div>
    );
  }

  const recruiters=company?.recruiters||[];
  const managers=company?.managers||[];

  return(
    <div style={{flex:1,minWidth:0,width:"100%",overflowY:"auto",padding:"32px 40px",background:T.bg}} className="fu">
      <div style={{maxWidth:640}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:T.display,fontSize:24,fontWeight:800,color:T.text,marginBottom:4}}>Settings</h1>
          <p style={{color:T.textMuted,fontSize:13}}>Manage accounts and preferences</p>
        </div>

        {/* Current User */}
        <Card style={{padding:24,marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:T.gradPrimary,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:20,fontWeight:800,color:"#fff"}}>
              {(currentUser?.name||"U").charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:T.text}}>{currentUser?.name}</div>
              <div style={{fontSize:12,color:T.textMuted,textTransform:"capitalize"}}>{currentUser?.role} · {company?.companyName}</div>
              <div style={{fontSize:11,color:T.textLight,marginTop:2}}>{currentUser?.email}</div>
            </div>
          </div>
          {saved&&<div style={{padding:"8px 12px",borderRadius:8,marginBottom:12,
            background:T.emeraldLight,border:`1px solid #A7F3D0`,color:T.emerald,fontSize:13}}>
            ✓ Role account created successfully!
          </div>}
        </Card>

        {/* Company Info */}
        <Card style={{padding:24,marginBottom:18}}>
          <h3 style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Company Information</h3>
          <div style={{display:"grid",gap:10}}>
            {[["Company Name",company?.companyName],["Company Email",company?.companyEmail],["Company ID",company?.companyId]].map(([lbl,val])=>(
              <div key={lbl} style={{display:"flex",gap:12,padding:"10px 13px",
                borderRadius:8,background:T.bgAlt,border:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.textMuted,width:110,flexShrink:0}}>{lbl}</span>
                <span style={{fontSize:12,color:T.textSub,fontFamily:T.mono,overflow:"hidden",textOverflow:"ellipsis"}}>{val||"—"}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Role Accounts */}
        <Card style={{padding:24,marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{fontSize:14,fontWeight:700,color:T.text}}>Role Accounts</h3>
            <Btn variant="outline" small onClick={()=>setShowCreateRole(true)}>+ Add Role</Btn>
          </div>
          {recruiters.length===0&&managers.length===0&&(
            <div style={{fontSize:13,color:T.textMuted,textAlign:"center",padding:"16px 0"}}>No role accounts created yet.</div>
          )}
          {[...recruiters.map(r=>({...r,roleType:"recruiter"})),...managers.map(r=>({...r,roleType:"manager"}))].map(r=>(
            <div key={r.roleId} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",
              borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:32,height:32,borderRadius:"50%",
                background:r.roleType==="recruiter"?T.accentLight:T.secondaryLight,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,fontWeight:800,color:r.roleType==="recruiter"?T.accent:T.secondary}}>
                {r.name.charAt(0).toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{r.name}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{r.email}</div>
              </div>
              <Badge color={r.roleType==="recruiter"?T.accent:T.secondary}
                bg={r.roleType==="recruiter"?T.accentLight:T.secondaryLight}>
                {r.roleType==="recruiter"?"Recruiter":"Manager"}
              </Badge>
              {r.password&&<Badge color={T.amber} bg={T.amberLight}>🔒 Password set</Badge>}
            </div>
          ))}
        </Card>

        {/* Sign out */}
        <Card style={{padding:22}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>Sign Out</div>
              <div style={{fontSize:12,color:T.textMuted}}>Return to the login screen</div>
            </div>
            <Btn variant="danger" small onClick={onLogout}>Sign Out</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════════════════════════════ */
export default function App(){
  // Auth: "login" | "signup" | "createRole" | null(logged in)
  const [authView,setAuthView]=useState(()=>{
    const s=LS.get("sh_session",null);
    return s?null:"login";
  });
  const [pendingCompany,setPendingCompany]=useState(null);
  const [session,setSession]=useState(()=>LS.get("sh_session",null));
  const [company,setCompany]=useState(()=>{
    const s=LS.get("sh_session",null);
    if(!s) return null;
    const cos=LS.get("sh_companies",[]);
    return cos.find(c=>c.companyId===s.companyId)||null;
  });

  // App state
  const [page,setPage]=useState("dashboard");
  const [selected,setSelected]=useState(null);

  const emptyJob={jobId:null,title:"",description:"",skills:"",experience:"",education:"",preferences:"",candidates:[]};

  const [activeJobId,setActiveJobId]=useState(()=>{
    const s=LS.get("sh_session",null);
    if(!s) return null;
    const cos=LS.get("sh_companies",[]);
    const co=cos.find(c=>c.companyId===s.companyId);
    const saved=LS.get("sh_activeJob_"+s.companyId,null);
    if(saved&&(co?.jobs||[]).find(j=>j.jobId===saved)) return saved;
    return co?.jobs?.[0]?.jobId||null;
  });

  const activeJobIdRef=useRef(activeJobId);

  const freshCompany=()=>{
    const s=LS.get("sh_session",null);
    if(!s) return null;
    const cos=LS.get("sh_companies",[]);
    return cos.find(c=>c.companyId===s.companyId)||null;
  };

  useEffect(()=>{
    activeJobIdRef.current=activeJobId;
    const s=LS.get("sh_session",null);
    if(s&&activeJobId) LS.set("sh_activeJob_"+s.companyId,activeJobId);
  },[activeJobId]);

  const activeJob=company?.jobs?.find(j=>j.jobId===activeJobId)||emptyJob;
  const candidates=activeJob?.candidates||[];
  const ranked=[...candidates].sort((a,b)=>b.matchScore-a.matchScore);

  // Auth handlers
  const handleCompanyCreated=(co)=>{
    setPendingCompany(co);
    setAuthView("createRole");
  };

  const handleRoleCreated=(updatedCo,roleAccount,roleType)=>{
    // Auto-login the created role
    const sess={
      companyId:updatedCo.companyId,
      companyName:updatedCo.companyName,
      companyEmail:updatedCo.companyEmail,
      roleId:roleAccount.roleId,
      name:roleAccount.name,
      email:roleAccount.email,
      role:roleType,
      id:roleAccount.roleId,
    };
    LS.set("sh_session",sess);
    setSession(sess);
    setCompany(updatedCo);
    setActiveJobId(updatedCo.jobs?.[0]?.jobId||null);
    setAuthView(null);
    setPendingCompany(null);
  };

  const handleSkipRole=()=>{
    // Just go to login — they can create roles later
    setAuthView("login");
    setPendingCompany(null);
  };

  const handleLogin=(sess,co)=>{
    // Re-read company from LS to get latest jobs
    const latestCo=freshCompany()||co;
    const savedJobId=LS.get("sh_activeJob_"+sess.companyId,null);
    const restoredId=(savedJobId&&(latestCo?.jobs||[]).find(j=>j.jobId===savedJobId))
      ? savedJobId
      : (latestCo?.jobs?.[0]?.jobId||null);
    setSession(sess);
    setCompany(latestCo||co);
    setActiveJobId(restoredId);
    setPage("dashboard");
    setAuthView(null);
  };

  const handleLogout=()=>{
    const s=LS.get("sh_session",null);
    if(s) LS.del("sh_activeJob_"+s.companyId);
    LS.del("sh_session");
    setSession(null);
    setCompany(null);
    setPage("dashboard");
    setSelected(null);
    setActiveJobId(null);
    setAuthView("login");
  };

  // Job persistence — uses company-level storage
  const handleJobSave=(jobData)=>{
    const cos=LS.get("sh_companies",[]);
    const s=LS.get("sh_session",null);
    if(!s) return;
    const co=cos.find(c=>c.companyId===s.companyId);
    if(!co) return;
    const currentAJId=activeJobIdRef.current;
    let jobs=[...(co.jobs||[])];
    const existing=jobs.find(j=>j.jobId===currentAJId);
    if(existing){
      jobs=jobs.map(j=>j.jobId===currentAJId?{...j,...jobData}:j);
    } else {
      const newJobId="j_"+Date.now();
      const newJob={...emptyJob,...jobData,jobId:newJobId,candidates:[]};
      jobs=[...jobs,newJob];
      activeJobIdRef.current=newJobId;
      setActiveJobId(newJobId);
      LS.set("sh_activeJob_"+s.companyId,newJobId);
    }
    const updatedCo={...co,jobs};
    const updatedCos=cos.map(c=>c.companyId===s.companyId?updatedCo:c);
    LS.set("sh_companies",updatedCos);
    setCompany(updatedCo);
  };

  const handleNewJob=()=>{
    activeJobIdRef.current=null;
    setActiveJobId(null);
    setPage("job");
  };

  const handleSelectJob=(jobId)=>{
    const co=freshCompany();
    if(!co) return;
    const jobExists=(co.jobs||[]).find(j=>j.jobId===jobId);
    if(!jobExists) return;
    activeJobIdRef.current=jobId;
    const s=LS.get("sh_session",null);
    if(s) LS.set("sh_activeJob_"+s.companyId,jobId);
    setCompany(co);
    setActiveJobId(jobId);
    setSelected(null);
    setPage("dashboard");
  };

  const handleCandidatesSaved=(updatedCandidates,forJobId)=>{
    const jid=forJobId||activeJobIdRef.current;
    const cos=LS.get("sh_companies",[]);
    const s=LS.get("sh_session",null);
    if(!s||!jid) return;
    const co=cos.find(c=>c.companyId===s.companyId);
    if(!co) return;
    const jobs=(co.jobs||[]).map(j=>
      j.jobId===jid?{...j,candidates:updatedCandidates}:j
    );
    const updatedCo={...co,jobs};
    const updatedCos=cos.map(c=>c.companyId===s.companyId?updatedCo:c);
    LS.set("sh_companies",updatedCos);
    setCompany(updatedCo);
  };

  const setCandidates=(fn)=>{
    const jid=activeJobIdRef.current;
    const cos=LS.get("sh_companies",[]);
    const s=LS.get("sh_session",null);
    if(!s||!jid) return;
    const co=cos.find(c=>c.companyId===s.companyId);
    const prevCandidates=co?.jobs?.find(j=>j.jobId===jid)?.candidates||[];
    const next=typeof fn==="function"?fn(prevCandidates):fn;
    handleCandidatesSaved(next,jid);
  };

  const handleStatusChange=(candidateId,newStatus)=>{
    const jid=activeJobIdRef.current;
    const cos=LS.get("sh_companies",[]);
    const s=LS.get("sh_session",null);
    if(!s||!jid) return;
    const co=cos.find(c=>c.companyId===s.companyId);
    if(!co) return;
    const jobs=(co.jobs||[]).map(j=>{
      if(j.jobId!==jid) return j;
      const updatedCandidates=(j.candidates||[]).map(c=>
        c.id===candidateId?{...c,status:newStatus}:c
      );
      return {...j,candidates:updatedCandidates};
    });
    const updatedCo={...co,jobs};
    const updatedCos=cos.map(c=>c.companyId===s.companyId?updatedCo:c);
    LS.set("sh_companies",updatedCos);
    setCompany(updatedCo);
    if(selected&&selected.id===candidateId){
      setSelected(prev=>({...prev,status:newStatus}));
    }
  };

  const goDetail=(c)=>{ setSelected(c); setPage("detail"); };

  const jobForPages={
    title:activeJob.title||"",
    description:activeJob.description||"",
    skills:activeJob.skills||"",
    experience:activeJob.experience||"",
    education:activeJob.education||"",
    preferences:activeJob.preferences||"",
    jobId:activeJob.jobId,
  };

  const setJobForPages=(updOrFn)=>{
    const next=typeof updOrFn==="function"?updOrFn(jobForPages):updOrFn;
    handleJobSave(next);
  };

  // Not logged in
  if(authView){
    return(
      <>
        <style>{G}</style>
        {authView==="login"&&<LoginPage onLogin={handleLogin} goSignup={()=>setAuthView("signup")}/>}
        {authView==="signup"&&<SignupPage onCompanyCreated={handleCompanyCreated} goLogin={()=>setAuthView("login")}/>}
        {authView==="createRole"&&pendingCompany&&(
          <CreateRolePage
            company={pendingCompany}
            onRoleCreated={handleRoleCreated}
            onSkip={handleSkipRole}
          />
        )}
      </>
    );
  }

  return(
    <>
      <style>{G}</style>
      <div style={{display:"flex",height:"100vh",width:"100%",overflow:"hidden",background:T.bg}}>
        {page!=="detail"&&(
          <Sidebar
            page={page} setPage={setPage}
            job={jobForPages}
            counts={{
              candidates:candidates.length,
              shortlisted:candidates.filter(c=>c.status==="shortlisted").length,
              rejected:candidates.filter(c=>c.status==="rejected").length
            }}
            currentUser={session}
            company={company}
            onProfileClick={()=>setPage("profile")}
            onSelectJob={handleSelectJob}
            onNewJob={handleNewJob}
          />
        )}
        <main style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
          {page==="dashboard"&&(
            <DashboardPage job={jobForPages} candidates={ranked} setPage={setPage}
              onNewJob={handleNewJob}
              jobCount={(company?.jobs||[]).length}
              currentUser={session}
              company={company}
            />
          )}
          {page==="job"&&(
            <JobPage job={jobForPages} setJob={setJobForPages} setPage={setPage}/>
          )}
          {page==="upload"&&(
            <UploadPage job={jobForPages} candidates={candidates}
              setCandidates={setCandidates}
              onCandidateAdded={(result)=>{
                const jid=activeJobIdRef.current;
                const cos=LS.get("sh_companies",[]);
                const s=LS.get("sh_session",null);
                if(!s||!jid) return;
                const co=cos.find(c=>c.companyId===s.companyId);
                const prev=co?.jobs?.find(j=>j.jobId===jid)?.candidates||[];
                const merged=[...prev.filter(c=>c.id!==result.id),result];
                handleCandidatesSaved(merged,jid);
              }}/>
          )}
          {page==="rankings"&&(
            <RankingsPage candidates={ranked} job={jobForPages} onSelect={goDetail} currentUser={session}/>
          )}
          {page==="shortlisted"&&(
            <RankingsPage candidates={ranked} job={jobForPages} onSelect={goDetail} filterStatus="shortlisted" currentUser={session}/>
          )}
          {page==="rejected"&&(
            <RankingsPage candidates={ranked} job={jobForPages} onSelect={goDetail} filterStatus="rejected" currentUser={session}/>
          )}
          {page==="detail"&&selected&&(
            <DetailPage candidate={selected} job={jobForPages} onBack={()=>setPage("rankings")}
              onStatusChange={handleStatusChange} currentUser={session} company={company}/>
          )}
          {page==="profile"&&(
            <ProfilePage currentUser={session} company={company}
              onLogout={handleLogout}
              onCreateRole={()=>{}}/>
          )}
        </main>
      </div>
    </>
  );
}
