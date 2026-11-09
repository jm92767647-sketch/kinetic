import React,{useEffect,useState} from 'react';
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
 useEffect(()=>{const change=()=>{setMode(currentMode());window.scrollTo(0,0)};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[]);
 return mode?renderGuide(mode):<Welcome/>;
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

function Welcome(){
 return <div className="welcome-screen">
  <header className="app-header welcome-header"><a className="brand" href="./">kinetic<span>.</span></a></header>
  <main className="welcome-main">
   <nav className="welcome-menu" aria-label="시작화면 보기 선택">
    {destinations.map(x=><a key={x.hash} className="welcome-menu-link" href={x.hash} onPointerMove={moveLight} onPointerLeave={clearLight}>
     <span className="welcome-glass" aria-hidden="true"><span className="welcome-glint"/><span className="welcome-rim"/><span className="welcome-caustic"/></span>
     <span>{x.title}</span>
    </a>)}
   </nav>
  </main>
 </div>;
}
