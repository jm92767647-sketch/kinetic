import React,{useEffect,useRef,useState} from 'react';
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
 return mode?renderGuide(mode):<Welcome onChoose={i=>{location.hash=destinations[i].hash}}/>;
}

function Welcome({onChoose}){
 const [index,setIndex]=useState(0),[drag,setDrag]=useState(0);
 const stage=useRef(null),pointer=useRef(null),suppressClick=useRef(0);
 const move=step=>{setIndex(i=>Math.max(0,Math.min(destinations.length-1,i+step)));if(document.activeElement?.classList.contains('welcome-card'))stage.current?.focus({preventScroll:true})};
 useEffect(()=>{
  const node=stage.current;let total=0,lockedUntil=0,lastEvent=0;
  const wheel=e=>{
   if(e.ctrlKey||e.metaKey)return;
   e.preventDefault();if(pointer.current)return;
   const now=performance.now();if(now<lockedUntil)return;
   if(now-lastEvent>160)total=0;lastEvent=now;
   const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
   total+=delta*(e.deltaMode===1?16:e.deltaMode===2?innerWidth:1);
   if(Math.abs(total)<38)return;
   move(total>0?1:-1);total=0;lockedUntil=now+520;
  };
  node.addEventListener('wheel',wheel,{passive:false});return()=>node.removeEventListener('wheel',wheel);
 },[]);
 const finish=e=>{
  const p=pointer.current;if(!p||p.id!==e.pointerId)return;
  const distance=e.clientX-p.x;
  if(p.moved){suppressClick.current=performance.now()+400;if(Math.abs(distance)>Math.min(80,innerWidth*.16))move(distance<0?1:-1)}
  if(stage.current.hasPointerCapture(e.pointerId))stage.current.releasePointerCapture(e.pointerId);
  pointer.current=null;setDrag(0);
 };
 const cancel=()=>{pointer.current=null;setDrag(0);suppressClick.current=performance.now()+400};
 const keyboard=e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}
  if(e.key==='Home'||e.key==='End'){e.preventDefault();setIndex(e.key==='Home'?0:3);stage.current.focus({preventScroll:true})}
  if(e.key==='Enter'&&e.target===e.currentTarget){e.preventDefault();onChoose(index)}
 };
 return <div className="welcome-screen">
  <header className="app-header welcome-header"><a className="brand" href="./">kinetic<span>.</span></a></header>
  <main ref={stage} className={'welcome-carousel'+(drag?' is-dragging':'')} tabIndex={0} aria-label="시작화면 보기 선택" aria-roledescription="carousel" onKeyDown={keyboard}
   onPointerDown={e=>{if(e.button!==0||e.target.closest('.welcome-arrow'))return;pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false}}}
   onPointerMove={e=>{const p=pointer.current;if(!p||p.id!==e.pointerId)return;const dx=e.clientX-p.x;if(!p.moved&&Math.abs(dx)>7&&Math.abs(dx)>Math.abs(e.clientY-p.y)){p.moved=true;stage.current.setPointerCapture(e.pointerId)}if(p.moved)setDrag(dx*((index===0&&dx>0)||(index===3&&dx<0)?.25:1))}}
   onPointerUp={finish} onPointerCancel={cancel}
   onClickCapture={e=>{if(performance.now()<suppressClick.current){e.preventDefault();e.stopPropagation()}}}>
   <div className="welcome-window"><div className="welcome-track" style={{'--active':index,'--drag-x':drag+'px'}}>
    {destinations.map((x,i)=><button key={x.hash} type="button" className={'welcome-card'+(index===i?' is-current':'')} style={{'--side':Math.sign(i-index)}} tabIndex={index===i?0:-1} aria-label={x.title} onClick={()=>onChoose(i)}
     onPointerMove={e=>{if(e.pointerType!=='mouse'||pointer.current?.moved)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--light-x',100*(e.clientX-r.left)/r.width+'%');e.currentTarget.style.setProperty('--light-y',100*(e.clientY-r.top)/r.height+'%')}}
     onPointerLeave={e=>{e.currentTarget.style.removeProperty('--light-x');e.currentTarget.style.removeProperty('--light-y')}}>
     <span className="welcome-glass" aria-hidden="true"><span className="welcome-glint"/><span className="welcome-rim"/><span className="welcome-caustic"/></span>
     <span className="welcome-card-title">{x.title}</span>
    </button>)}
   </div></div>
   <button className="welcome-arrow welcome-prev" type="button" aria-label="이전 카드" disabled={index===0} onClick={()=>move(-1)}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m19 7-9 9 9 9"/></svg></button>
   <button className="welcome-arrow welcome-next" type="button" aria-label="다음 카드" disabled={index===3} onClick={()=>move(1)}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m13 7 9 9-9 9"/></svg></button>
   <span className="welcome-announcement" role="status" aria-live="polite">{index+1} / 4 · {destinations[index].title}</span>
  </main>
 </div>;
}
