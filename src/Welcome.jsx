import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import './Welcome.css';

const destinations=[
 {title:'By Day Routine',mode:'데이별',hash:'#day'},
 {title:'By Muscle Group',mode:'부위별',hash:'#muscle'},
 {title:'By Training Type',mode:'훈련능력별',hash:'#training'},
 {title:'Training Matrix',mode:'구성표',hash:'#matrix'},
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
  const stage=overlay.current, moving=card.current;
  if(!target||!stage||!moving){finish();return}

  const from=flight.rect;
  const aim=()=>{
   const to=target.getBoundingClientRect();
   moving.style.setProperty('--flight-x',(to.left-from.left)+'px');
   moving.style.setProperty('--flight-y',(to.top-from.top)+'px');
   moving.style.setProperty('--flight-scale-x',to.width/from.width);
   moving.style.setProperty('--flight-scale-y',to.height/from.height);
  };
  const preventScroll=e=>e.preventDefault();
  const arrived=e=>{if(e.target===moving&&e.animationName==='welcome-travel')finish()};
  window.scrollTo(0,0);
  aim();
  moving.addEventListener('animationend',arrived);
  stage.addEventListener('wheel',preventScroll,{passive:false});
  window.addEventListener('resize',aim);
  window.addEventListener('scroll',aim);
  stage.dataset.ready='true';
  const fallback=window.setTimeout(finish,1200);
  return()=>{
   window.clearTimeout(fallback);
   moving.removeEventListener('animationend',arrived);
   stage.removeEventListener('wheel',preventScroll);
   window.removeEventListener('resize',aim);
   window.removeEventListener('scroll',aim);
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
  <div ref={guide} inert={flight?true:undefined}>{renderGuide(mode??flight.destination.mode)}</div>
  {flight&&<div className="welcome-transition" ref={overlay} aria-hidden="true">
   <div className="welcome-transition-cover" inert><Welcome departing={flight.destination.hash}/></div>
   <div className="welcome-menu-link welcome-flight-card" ref={card} style={{left:flight.rect.left,top:flight.rect.top,width:flight.rect.width,height:flight.rect.height}}>
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
  <header className="app-header welcome-header"><a className="brand" href="./">kinetic<span>.</span></a></header>
  <main className="welcome-main">
   <nav className="welcome-menu" aria-label="시작화면 보기 선택">
    {destinations.map(x=><a key={x.hash} className="welcome-menu-link" href={x.hash} data-departing={departing===x.hash||undefined} onClick={onChoose?e=>onChoose(e,x):undefined} onPointerMove={moveLight} onPointerLeave={clearLight}>
     <Glass/>
     <span>{x.title}</span>
    </a>)}
   </nav>
  </main>
 </div>;
}
