import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {days,muscles,trainingGroups} from './data.js';
import './Welcome.css';

const asset=path=>`${import.meta.env.BASE_URL}${path}`;
const trainingTypes=Object.keys(trainingGroups);
const destinations=[
 {title:'By Day Routine',mode:'데이별',hash:'#day',note:`데이별 · ${days.length} days`,chips:days.slice(0,2),more:days.length-2,figure:'media/exercises/lyfta-004-video-cutout.webp'},
 {title:'By Muscle Group',mode:'부위별',hash:'#muscle',note:`부위별 · ${muscles.length} muscles`,chips:muscles.slice(0,3),more:muscles.length-3,figure:'media/exercises/lyfta-023-video-cutout.webp'},
 {title:'By Training Type',mode:'훈련능력별',hash:'#training',note:`훈련능력별 · ${trainingTypes.length} types`,chips:trainingTypes.slice(0,3).map(x=>x.replace('(근비대)','')),more:trainingTypes.length-3,figure:'media/exercises/lyfta-047-video-cutout.webp'},
 {title:'Training Matrix',mode:'구성표',hash:'#matrix',note:'구성표 · 전체 프로그램',chips:['한눈에 보기'],more:0,figure:'media/exercises/lyfta-042-video-cutout.webp'},
];
const currentMode=()=>destinations.find(x=>x.hash===location.hash)?.mode||(location.hash==='#exercise-browser'?'데이별':null);

export default function WelcomeEntry({renderGuide}){
 const [mode,setMode]=useState(currentMode);
 const [flight,setFlight]=useState(null);
 const guide=useRef(null),overlay=useRef(null),card=useRef(null),focusTab=useRef(false);

 useEffect(()=>{
  const change=()=>{setMode(currentMode());setFlight(null);window.scrollTo(0,0)};
  window.addEventListener('hashchange',change);
  return()=>window.removeEventListener('hashchange',change);
 },[]);

 useLayoutEffect(()=>{
  const tabs=guide.current?.querySelectorAll('.view-tabs button');
  const target=Array.from(tabs??[]).find(tab=>tab.dataset.viewMode===(flight?.destination.mode??mode));
  if(!flight){
   if(mode&&focusTab.current){target?.focus({preventScroll:true});focusTab.current=false}
   return;
  }
  let finished=false;
  const finish=()=>{
   if(finished)return;
   finished=true;
   focusTab.current=true;
   location.hash=flight.destination.hash;
   setMode(flight.destination.mode);
   setFlight(null);
  };
  const stage=overlay.current;
  if(!stage){finish();return}
  const preventScroll=e=>e.preventDefault();
  const handedOver=e=>{if(e.target===stage&&e.animationName==='welcome-handoff')finish()};
  window.scrollTo(0,0);
  stage.addEventListener('animationend',handedOver);
  stage.addEventListener('wheel',preventScroll,{passive:false});
  stage.dataset.ready='true';
  const fallback=window.setTimeout(finish,1600);
  return()=>{
   window.clearTimeout(fallback);
   stage.removeEventListener('animationend',handedOver);
   stage.removeEventListener('wheel',preventScroll);
   delete stage.dataset.ready;
  };
 },[flight,mode]);

 function choose(event,destination){
  if(event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  event.preventDefault();
  if(flight)return;
  const el=event.currentTarget;
  setFlight({destination,rect:el.getBoundingClientRect()});
 }

 if(!mode&&!flight)return <Welcome onChoose={choose}/>;
 return <>
  <div ref={guide} className={flight?'welcome-arriving':undefined} inert={flight?true:undefined}>{renderGuide(mode??flight.destination.mode)}</div>
  {flight&&<div className="welcome-transition" ref={overlay} aria-hidden="true">
   <div className="welcome-transition-cover" inert><Welcome departing={flight.destination.hash}/></div>
   <div className="welcome-menu-link welcome-flight-card" ref={card} style={{'--from-x':`${flight.rect.left}px`,'--from-y':`${flight.rect.top}px`,'--from-w':`${flight.rect.width}px`,'--from-h':`${flight.rect.height}px`,left:flight.rect.left,top:flight.rect.top,width:flight.rect.width,height:flight.rect.height}}>
    <Glass/>
   </div>
  </div>}
 </>;
}

function Glass(){
 return <span className="welcome-glass" aria-hidden="true"><span className="welcome-glint"/><span className="welcome-rim"/><span className="welcome-caustic"/></span>;
}

function moveLight(e){
 if(e.pointerType!=='mouse')return;
 const {style}=e.currentTarget;
 const rect=e.currentTarget.getBoundingClientRect();
 style.setProperty('--light-x',100*(e.clientX-rect.left)/rect.width+'%');
 style.setProperty('--light-y',100*(e.clientY-rect.top)/rect.height+'%');
}

function clearLight(e){
 e.currentTarget.style.removeProperty('--light-x');
 e.currentTarget.style.removeProperty('--light-y');
}

function Welcome({onChoose,departing}){
 return <div className="welcome-screen">
  <header className="app-header welcome-header">
   <a className="brand" href="./">kinetic<span>.</span></a>
   <span className="welcome-meta">31 Exercises · {days.length} Days</span>
  </header>
  <main className="welcome-main">
   <h1 className="welcome-title">Train with <em>intent.</em></h1>
   <nav className="welcome-menu" aria-label="시작화면 보기 선택">
    {destinations.map((x,i)=><a key={x.hash} className="welcome-menu-link" href={x.hash} data-departing={departing===x.hash||undefined} onClick={onChoose?e=>onChoose(e,x):undefined} onPointerMove={moveLight} onPointerLeave={clearLight}>
     <Glass/>
     <span className="welcome-card-index">{String(i+1).padStart(2,'0')}</span>
     <span className="welcome-card-body">
      <span className="welcome-card-title">{x.title}</span>
      <small className="welcome-card-note">{x.note}</small>
     </span>
     <span className="welcome-card-chips" aria-hidden="true">
      {x.chips.map(chip=><span key={chip}>{chip}</span>)}
      {x.more>0&&<span>+{x.more}</span>}
     </span>
     <img className="welcome-card-figure" src={asset(x.figure)} alt="" loading="lazy" decoding="async"/>
     <span className="welcome-card-go" aria-hidden="true">→</span>
    </a>)}
   </nav>
  </main>
 </div>;
}
