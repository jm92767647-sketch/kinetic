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
 const guide=useRef(null),cover=useRef(null),card=useRef(null),focusTab=useRef(false);

 useEffect(()=>{
  const change=()=>{setMode(currentMode());setFlight(null);window.scrollTo(0,0)};
  window.addEventListener('hashchange',change);
  return()=>window.removeEventListener('hashchange',change);
 },[]);

 useLayoutEffect(()=>{
  const target=guide.current?.querySelector('.view-tabs button[aria-pressed="true"]');
  if(!flight){
   if(mode&&focusTab.current){target?.focus({preventScroll:true});focusTab.current=false}
   return;
  }
  const finish=()=>{
   focusTab.current=true;
   location.hash=flight.destination.hash;
   setMode(flight.destination.mode);
   setFlight(null);
  };
  if(!target||!card.current?.animate){finish();return}

  window.scrollTo(0,0);
  const to=target.getBoundingClientRect(),from=flight.rect;
  const land='translate('+(to.left-from.left)+'px,'+(to.top-from.top)+'px) scale('+to.width/from.width+','+to.height/from.height+')';
  const motion=card.current.animate(
   [{transform:'none'},{transform:land}],
   {duration:580,easing:'cubic-bezier(.62,.02,.28,1)',fill:'forwards'}
  );
  const fadeCard=card.current.animate([{opacity:1},{opacity:0}],{delay:475,duration:105,fill:'forwards'});
  const reveal=cover.current.animate([{opacity:1},{opacity:0}],{delay:410,duration:170,fill:'forwards'});
  motion.onfinish=finish;
  window.addEventListener('resize',finish,{once:true});
  return()=>{
   motion.onfinish=null;
   motion.cancel();fadeCard.cancel();reveal.cancel();
   window.removeEventListener('resize',finish);
  };
 },[flight,mode]);

 function choose(event,destination){
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  event.preventDefault();
  if(flight)return;
  const el=event.currentTarget;
  setFlight({destination,rect:el.getBoundingClientRect(),fontSize:getComputedStyle(el).fontSize});
 }

 if(!mode&&!flight)return <Welcome onChoose={choose}/>;
 return <>
  <div ref={guide} inert={flight?true:undefined}>{renderGuide(mode??flight.destination.mode)}</div>
  {flight&&<div className="welcome-transition" aria-hidden="true">
   <div className="welcome-transition-cover" ref={cover} inert><Welcome departing={flight.destination.hash}/></div>
   <div className="welcome-menu-link welcome-flight-card" ref={card} style={{left:flight.rect.left,top:flight.rect.top,width:flight.rect.width,height:flight.rect.height,fontSize:flight.fontSize}}>
    <Glass/><span>{flight.destination.title}</span>
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
