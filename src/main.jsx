import React,{useState} from 'react';
import{createRoot}from'react-dom/client';
import{days,conditioningPlan,regionMuscles,trainingGroups,matchesTrainingGroup,principles,exercises,powerWarning,progressionType}from'./data';
import Anatomy from './Anatomy';
import './styles.css';
const isPower=e=>e.tags.some(t=>t.includes('파워'));
function Badge({tag}){return <span className={`badge ${tag.includes('파워')?'power':tag==='최대근력'?'strength':tag.includes('감속')||tag.includes('편심')?'brake':'other'}`}>{tag}</span>}
function Progression({e}){return <section className="progression"><h3>어떻게 강도를 높이는가? <span>↗</span></h3><div className="progress-ribbon">{progressionType(e).map((x,i)=><React.Fragment key={x}>{i>0&&<span>→</span>}<b>{x}</b></React.Fragment>)}</div><ol className="steps-progress">{e.progress.map((x,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span>{x}</li>)}</ol></section>}
function Details({e,select,nested=false}){return <article className={nested?'alternative':'detail-content'}>
 {nested&&<div className="alternative-label">↳ 가장 가까운 야외/간단기구 대체운동</div>}
 <div className="detail-title"><div className="badges">{e.tags.map(t=><Badge key={t} tag={t}/>)}</div><h2>{e.name}</h2>{e.id==='depth'&&<p className="hint">CMJ의 고급 선택지 · 추가 필수 운동이 아닙니다.</p>}{e.id==='boxing'&&<p className="hint">스프린트 인터벌의 전신 대체모드입니다. 달리기의 역학적 자극과 동일하지 않습니다.</p>}{nested&&<p className="hint">{e.id==='rdl'?'야외·간단기구 최대근력 대체. ':''}원운동과 부하·속도·기술 요구가 완전히 같지는 않습니다.</p>}<p className="detail-muscles">{e.muscleDetail||e.primary.join(' · ')}</p></div>
 <div className="prescription"><div><span>기본 운동량</span><strong>{e.dose}</strong></div><div><span>{e.id==='run'?'운동 강도':'휴식'}</span><strong>{e.rest}</strong></div></div>
 {e.id==='nordic'&&<p className="hint">적응 후 필요하면 3세트로 늘립니다.</p>}
 {e.id==='hardpush'&&<p className="hint">각 단계에서 8회가 안정적으로 가능하면 다음 단계로 이동합니다.</p>}
 <section className="purpose"><h3>목적 & 수행 원칙</h3>{e.purposeOverride?<p><b>{e.tags.join(' · ')}</b> {e.purpose}</p>:e.tags.map(t=><p key={t}><b>{t}</b> {principles[t]}</p>)}</section>
 {isPower(e)&&<div className="warning"><span>!</span><p>{powerWarning}</p></div>}
 <section><h3>수행방법</h3><ol className="instructions">{e.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></section>
 <section className="cues"><h3>핵심 자세 포인트</h3>{e.cues.map(c=><p key={c}>✓ {c}</p>)}</section>
 <section className="stop"><h3>주의 · 이때 세트를 끝내세요</h3><p>{e.stop.join(' / ')}</p><p>통증이 생기면 중단하고 동작과 강도를 재평가합니다.</p></section>
 <Progression e={e}/>{e.id==='decel'&&<div className="dual-metric"><div>가속 기록<strong>시간 ↓ / 속도 ↑</strong></div><div>감속 기록<strong>8 → 7 → 6 → 5m</strong></div><small>같은 진입속도의 제동 능력을 먼저 비교합니다.</small></div>}
 {nested&&<button className="alt-action" onClick={()=>select(e.id)}>이 대체운동 동작 보기 <span>↗</span></button>}
 </article>}

function App(){
 const [mode,setMode]=useState('데이별');
 const [day,setDay]=useState(0),[region,setRegion]=useState(''),[muscle,setMuscle]=useState(''),[ability,setAbility]=useState('');
 const [selected,setSelected]=useState('ankle');
 const filters={mode,day,region,muscle,ability};
 const match=(x,f=filters)=>f.mode==='데이별'?(f.day===null||x.day===f.day):f.mode==='부위별'?(!f.region||x.regions.includes(f.region))&&(!f.muscle||[...x.primary,...x.secondary].includes(f.muscle)):matchesTrainingGroup(x,f.ability);
 const visible=exercises.filter(x=>match(x));
 const e=visible.find(x=>x.id===selected)||visible[0];
 const choose=id=>{setSelected(id);if(innerWidth<=700)requestAnimationFrame(()=>document.querySelector('.center')?.scrollIntoView({behavior:'smooth',block:'start'}))};
 const apply=(key,value)=>{({day:setDay,region:setRegion,muscle:setMuscle,ability:setAbility})[key](value);if(key==='region')setMuscle('');const next=exercises.filter(x=>match(x,{...filters,[key]:value,...(key==='region'?{muscle:''}:{})}));if(next.length&&!next.some(x=>x.id===selected))setSelected(next[0].id)};
 const reset=()=>{setDay(null);setRegion('');setMuscle('');setAbility('');setSelected('ankle')};
 const view=m=>{setMode(m);setDay(m==='데이별'?0:null);setRegion('');setMuscle('');setAbility('');setSelected('ankle')};
 const showRelated=id=>{const target=exercises.find(x=>x.id===id);if(!match(target)){if(mode==='부위별'){setRegion('');setMuscle('')}else if(mode==='훈련능력별')setAbility('')}choose(id)};
 const alternatives=e?exercises.filter(x=>x.parent===e.id):[];
 const parent=e?.parent&&exercises.find(x=>x.id===e.parent);
 return <>
  <header className="app-header"><a className="brand" href="./">kinetic<span>.</span></a><nav className="view-tabs" aria-label="보기 방식">{['데이별','부위별','훈련능력별'].map(m=><button key={m} onClick={()=>view(m)} className={mode===m?'active':''} aria-pressed={mode===m}>{m}</button>)}</nav><span className="header-note">나의 운동 가이드</span></header>
  {mode==='데이별'&&<nav className="day-tabs" aria-label="트레이닝 데이">{days.map((d,i)=><button key={d} aria-pressed={day===i} className={day===i?'active':''} onClick={()=>apply('day',i)}><span>0{i+1}</span>{d.replace(' 데이','')}</button>)}</nav>}

  {mode==='부위별'&&<nav className="classification-bar region-tabs" aria-label="부위 분류">{Object.entries(regionMuscles).map(([r,items])=><div key={r} className={'region-category '+(region===r?'expanded':'')}><button className={'region-tab '+(region===r?'active':'')} aria-expanded={region===r} aria-controls={'muscles-'+r} onClick={()=>apply('region',region===r?'':r)}>{r}</button>{region===r&&<div id={'muscles-'+r} className="muscle-subcategories" aria-label={r+' 세부 근육'}>{items.map(m=><button key={m} className={muscle===m?'active':''} aria-pressed={muscle===m} onClick={()=>apply('muscle',muscle===m?'':m)}>{m==='코어'?'복부·코어':m}</button>)}</div>}</div>)}</nav>}
  {mode==='훈련능력별'&&<nav className="classification-bar ability-tabs" aria-label="훈련능력 분류">{Object.keys(trainingGroups).map(a=><button key={a} aria-pressed={ability===a} className={ability===a?'active':''} onClick={()=>apply('ability',ability===a?'':a)}>{a}</button>)}</nav>}
  <main className="dashboard">
   <aside className="sidebar" id="exercise-browser">
    <div className="list-heading"><h2>운동</h2><button className="text-button" onClick={reset}>전체보기</button></div>
    <div className="exercise-list" aria-label="운동 목록">{visible.map(x=><button key={x.id} className={'exercise-item '+(e?.id===x.id?'active ':'')+(x.parent?'is-alternative':'')} onClick={()=>choose(x.id)} aria-pressed={e?.id===x.id} aria-label={x.parent?x.name+' (대체운동)':x.name}>{x.parent&&<span className="alternative-branch" aria-hidden="true">↳</span>}{x.name}</button>)}</div>
    {!visible.length&&<div className="empty"><p>일치하는 운동이 없습니다.</p><button onClick={reset}>필터 초기화</button></div>}
   </aside>
   {e?<><div className="center"><a className="mobile-exercise-jump" href="#exercise-browser">운동 선택 ↓</a><Anatomy key={e.id} exercise={e}/></div>
    <aside className="detail"><h2 className="notes-heading">운동 노트</h2>{parent&&<button className="parent-link" onClick={()=>showRelated(parent.id)}>← {parent.name}</button>}{e.day===5&&<section className="purpose" aria-label="컨디셔닝 주간 구성"><h3>컨디셔닝 · A/B주 교대</h3>{conditioningPlan.weeks.map(w=><p key={w.name}><b>{w.name}</b> {w.text}</p>)}<p>{conditioningPlan.note}</p></section>}<Details e={e} select={showRelated}/>{alternatives.map(a=><Details key={a.id} e={a} select={showRelated} nested/>)}</aside></>:<div className="no-results"><p>다른 부위나 근육을 선택해 보세요.</p></div>}
  </main>
  <footer>동작 이해를 위한 2차원 가이드</footer>
 </>;
}
createRoot(document.getElementById('root')).render(<App/>);
