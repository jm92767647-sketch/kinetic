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

function Welcome(){
 return <div className="welcome-screen">
  <header className="app-header welcome-header"><a className="brand" href="./">kinetic<span>.</span></a></header>
  <main className="welcome-main">
   <nav className="welcome-menu" aria-label="시작화면 보기 선택">
    {destinations.map(x=><a key={x.hash} className="welcome-menu-link" href={x.hash}>{x.title}</a>)}
   </nav>
  </main>
 </div>;
}
