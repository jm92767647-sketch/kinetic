import React,{useEffect,useState,useId} from 'react';
import MuscleFigure from './MuscleFigure';
// 각 pose: 머리, 어깨, 골반, 왼/오 팔꿈치·손, 왼/오 무릎·발목.
const pose=(h,s,p,el,hl,er,hr,kl,fl,kr,fr)=>({h,s,p,el,hl,er,hr,kl,fl,kr,fr});
const stand=pose([245,108],[245,148],[245,258],[208,200],[203,247],[280,200],[287,247],[224,326],[218,393],[271,326],[282,393]);
const squat=pose([244,163],[244,204],[214,298],[216,215],[238,192],[283,217],[258,190],[271,331],[247,394],[298,333],[283,394]);
const jump=pose([245,65],[245,104],[245,210],[209,79],[190,38],[281,79],[300,38],[228,280],[221,344],[269,280],[277,344]);
const split0=pose([246,110],[246,150],[248,260],[210,201],[219,245],[280,200],[268,245],[211,324],[210,394],[305,311],[343,321]);
const split1=pose([231,158],[231,198],[241,300],[199,224],[216,180],[271,224],[253,180],[191,324],[210,394],[294,356],[343,321]);
const split2=pose([245,60],[245,100],[251,208],[213,118],[222,75],[279,118],[269,75],[218,278],[216,348],[297,257],[343,321]);

const push0=pose([154,255],[186,277],[303,305],[181,334],[180,389],[214,334],[217,389],[355,350],[398,391],[364,345],[410,391]);
const push1=pose([149,326],[180,343],[299,356],[135,355],[180,389],[239,360],[217,389],[350,374],[398,391],[362,372],[410,391]);
const kneel=pose([241,137],[241,177],[241,285],[209,217],[209,264],[272,218],[272,264],[241,367],[321,390],[261,367],[342,390]);
const nordic=pose([123,282],[154,300],[217,341],[117,327],[99,368],[179,336],[183,376],[261,367],[331,390],[278,367],[347,390]);
const reverse=pose([344,197],[328,235],[291,305],[308,249],[273,274],[340,264],[301,297],[241,367],[166,391],[261,367],[184,391]);
const rdl=pose([133,250],[174,258],[282,269],[184,310],[193,360],[211,310],[222,360],[276,326],[267,394],[345,264],[413,261]);
const runA=pose([254,90],[248,130],[232,243],[204,165],[234,200],[292,174],[306,136],[174,278],[217,319],[275,305],[258,384]);

const runB=pose([254,97],[248,137],[232,250],[290,178],[313,143],[211,172],[237,207],[280,308],[263,390],[179,287],[220,327]);
const overhead=pose([245,108],[245,148],[245,258],[211,105],[210,57],[281,105],[280,57],[224,326],[218,393],[271,326],[282,393]);
const rack={...stand,el:[206,184],hl:[219,143],er:[285,184],hr:[270,143]};
const reach={...stand,el:[291,157],hl:[345,152],er:[296,175],hr:[348,156]};
const rotation0={...stand,s:[224,148],el:[176,190],hl:[165,238],er:[208,206],hr:[168,234]};
const rotation1={...stand,s:[267,148],el:[312,169],hl:[362,132],er:[320,186],hr:[364,137]};
const hang=pose([245,191],[245,231],[245,324],[210,161],[200,95],[280,161],[290,95],[229,372],[241,417],[273,372],[285,417]);
const pulled=pose([245,80],[245,120],[245,233],[181,143],[200,95],[309,143],[290,95],[223,303],[243,361],[269,303],[285,361]);
const bench0=pose([147,263],[184,276],[309,277],[188,217],[194,151],[221,217],[222,151],[352,325],[347,393],[375,322],[386,393]);
const bench1={...bench0,el:[148,271],hl:[194,231],er:[263,270],hr:[222,231]};
const pike0=pose([176,295],[200,266],[275,186],[170,325],[143,391],[205,325],[180,391],[341,282],[393,391],[350,282],[410,391]);
const pike1={...pike0,h:[152,354],s:[187,315],p:[272,215],el:[120,338],er:[222,349]};
const rollout={...kneel,h:[130,283],s:[167,302],p:[247,340],el:[126,336],hl:[89,373],er:[145,344],hr:[98,373]};
const pistol0={...stand,kr:[311,278],fr:[365,286],el:[195,171],hl:[147,178],er:[294,172],hr:[337,175]};
const pistol1={...squat,kr:[330,323],fr:[398,336],el:[196,218],hl:[145,214],er:[279,215],hr:[330,211]};
const faces0={...stand,el:[294,158],hl:[344,164],er:[293,181],hr:[344,175]};
const faces1={...stand,el:[194,182],hl:[221,137],er:[296,182],hr:[267,137]};
const external0={...stand,el:[207,228],hl:[248,228],er:[281,228],hr:[320,228]};
const external1={...external0,hl:[157,228]};
function frames(m){switch(m){case'split':return [split0,split1,split2,split1,split0];case'rdl':return[stand,rdl,rdl,stand,stand];case'nordic':return[kneel,nordic,nordic,kneel,kneel];case'reverse':return[kneel,reverse,reverse,kneel,kneel];case'pushup':return[push0,push1,{...push0,hl:[180,366],hr:[217,366]},push0,push0];case'pike':return[pike0,pike1,pike0,pike0,pike0];case'rollout':return[kneel,rollout,rollout,kneel,kneel];case'pullup':return[hang,hang,pulled,pulled,hang];case'bench':return[bench0,bench1,bench1,bench0,bench0];case'press':return[rack,{...rack,h:[245,128],s:[245,168],p:[237,278],kl:[211,331],kr:[278,331],el:[206,204],hl:[219,163],er:[285,204],hr:[270,163]},overhead,overhead,rack];case'rotation':case'scoop':return[rotation0,rotation0,rotation1,rotation1,rotation0];case'chest':return[rack,rack,reach,reach,rack];case'face':case'bandface':return[faces0,faces0,faces1,faces1,faces0];case'external':case'bandexternal':return[external0,external0,external1,external1,external0];case'pistol':return[pistol0,pistol1,pistol1,pistol0,pistol0];case'boxing':return[rack,{...reach,hr:[260,148]},rack,{...reach,hl:[250,144]},rack];case'run':case'sprint':case'flying':case'decel':return[runA,runB,runA,runB,runA];case'lateral':return[split0,split1,{...jump,p:[280,210]},split1,split0];case'depth':return[stand,squat,jump,squat,stand];case'deadlift':return[stand,{...squat,hl:[218,350],hr:[291,350]},stand,stand,stand];case'squat':return[rack,squat,squat,rack,rack];case'trapjump':case'dbjump':return[stand,{...squat,hl:[205,342],hr:[315,342]},{...jump,el:[207,155],hl:[206,204],er:[283,155],hr:[284,204]},squat,stand];default:return[stand,squat,jump,squat,stand];}}
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
export default function Anatomy({exercise:e}){
 const [speed,setSpeed]=useState(()=>matchMedia("(prefers-reduced-motion: reduce)").matches?0:1),[time,setTime]=useState(0);const uid=useId().replaceAll(':','');
 useEffect(()=>{setTime(0)},[e.id]);
 useEffect(()=>{let handle,last;const tick=now=>{if(last&&speed){const delta=Math.max(0,Math.min(now-last,80))*speed/4800;setTime(t=>(t+delta)%1)}last=now;handle=requestAnimationFrame(tick)};handle=requestAnimationFrame(tick);return()=>cancelAnimationFrame(handle)},[speed]);
 const f=frames(e.motion),v=((time%1+1)%1)*4,i=Math.min(3,Math.floor(v)),t=(1-Math.cos((v-i)*Math.PI))/2,p=Object.fromEntries(Object.keys(stand).map(k=>[k,mix(f[i][k],f[i+1][k],t)]));
 if(e.motion==='decel'&&time>.58){const brake=Math.min(1,(time-.58)/.22);const stopped={...stand,p:[226,277],s:[248,165],h:[252,125],kl:[194,338],fl:[176,393],kr:[285,327],fr:[305,393]};for(const k of Object.keys(p))p[k]=mix(p[k],stopped[k],brake)}
 if(e.motion==='depth'&&time<.2){const lift=1-time/.2;for(const k of Object.keys(p)){p[k][0]-=150*lift;p[k][1]-=55*lift}}
 const isRun=['run','sprint','flying','decel'].includes(e.motion),isJump=['split','jump','depth','trapjump','dbjump','lateral'].includes(e.motion),band=['scoop','bandface','bandexternal','face','external'].includes(e.motion);
 const shift=isRun?(e.motion==='decel'?Math.min(time/.65,1)*130-65:Math.sin(time*Math.PI*2)*12):e.motion==='lateral'?Math.sin(time*Math.PI*2)*65:0;
 return <section className="movement"><h1 className="movement-heading">{e.name}</h1><div className="anatomy-stage">
 <svg viewBox="0 0 500 470" role="img" aria-label={`${e.name} 관절·근육 동작 애니메이션`} data-motion={e.motion} data-phase={i}>
 <defs><marker id={`${uid}arrow`} markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#6599c8"/></marker></defs>
 <ellipse cx="253" cy="411" rx="112" ry="13" fill="#8fb5d0" opacity=".12"/><path d="M45 405H455" stroke="#b8d0e2"/><path d="M70 416H430" stroke="#d8e7f0"/>
 {isRun&&<g fontSize="12" fill="#607e96"><path d="M50 435H444" stroke="#6599c8" markerEnd={`url(#${uid}arrow)`}/><text x="50" y="457">{e.motion==='flying'?'20~30m 가속':e.motion==='decel'?'15m 최대가속':'진행 방향'}</text><text x="280" y="457">{e.motion==='decel'?'기준선 → 6~8m 감속':e.motion==='flying'?'15~30m 최고속도':''}</text>{e.motion==='decel'&&<><rect x="290" y="65" width="155" height="340" fill="#d4a767" opacity=".05"/><path d="M290 75V406" stroke="#d4a767" strokeDasharray="4 6"/></>}</g>}
 {e.motion==='split'&&<g><path d="M324 324H380V402M332 324V402" fill="none" stroke="#9cb5c6" strokeWidth="8"/><text x="333" y="430" fill="#698397" fontSize="12">뒷발 지지</text></g>}
 {e.motion==='depth'&&<g><path d="M56 350H127V405H56Z" fill="#dbe8f1" stroke="#8ea9bd"/><text x="51" y="336" fill="#698397" fontSize="12">낮은 박스 ↓</text></g>}
 {e.motion==='bench'&&<path d="M135 294H330M161 294V400M310 294V400" stroke="#9cb5c6" strokeWidth="10"/>}
 {e.motion==='pullup'&&<path d="M138 95H352M151 95V403M340 95V403" stroke="#9cb5c6" strokeWidth="8"/>}
 {isJump&&<g fill="none" stroke="#6599c8"><path d={e.motion==='lateral'?'M100 210Q250 10 400 210':'M375 295Q419 175 375 80'} strokeDasharray="5 7" opacity=".55" markerEnd={`url(#${uid}arrow)`}/><path d="M151 390V335" strokeWidth="2" markerEnd={`url(#${uid}arrow)`}/><text x="61" y="366" fill="#698397" stroke="none" fontSize="12">지면 반력 ↑</text></g>}
 <g transform={`translate(${shift} 0)`}><g>
 {band&&<g><path d={`M${e.motion==='scoop'?'70 350':e.motion.includes('external')?'420 228':'420 170'} L${p.hl} M${e.motion==='scoop'?'70 350':e.motion.includes('external')?'420 228':'420 170'} L${p.hr}`} stroke="#6d8faa" strokeWidth="3"/><circle cx={e.motion==='scoop'?70:420} cy={e.motion==='scoop'?350:e.motion.includes('external')?228:170} r="7" fill="#6d8faa"/><text x={e.motion==='scoop'?43:393} y={e.motion==='scoop'?374:e.motion.includes('external')?205:147} fill="#6d8faa" fontSize="12">고정점</text><path d={e.motion==='scoop'?'M157 323L91 352':e.motion.includes('external')?'M333 244L401 229':'M332 202L401 177'} stroke="#6d8faa" markerEnd={`url(#${uid}arrow)`}/></g>}
 <MuscleFigure points={p} exercise={e}/>
 {['press','squat','bench'].includes(e.motion)&&<g><path d={`M${p.hl[0]-37} ${p.hl[1]}H${p.hr[0]+37}`} stroke="#7e9bb0" strokeWidth="5"/>{[p.hl[0]-32,p.hr[0]+32].map((x,j)=><rect key={j} x={x-6} y={p.hl[1]-22} width="12" height="44" rx="3" fill="#a8bfce" stroke="#7897ad"/>)}</g>}
 {['deadlift','trapjump','dbjump','rdl'].includes(e.motion)&&<g>{['hl','hr'].map(k=><g key={k}><path d={`M${p[k][0]-18} ${p[k][1]}h36`} stroke="#7897ad" strokeWidth="5"/><rect x={p[k][0]-22} y={p[k][1]-14} width="10" height="28" rx="3" fill="#9fb6c8"/><rect x={p[k][0]+12} y={p[k][1]-14} width="10" height="28" rx="3" fill="#9fb6c8"/></g>)}{['deadlift','trapjump'].includes(e.motion)&&<path d={`M${p.hl}l10 17H${p.hr[0]-10}L${p.hr}`} fill="none" stroke="#7897ad" strokeWidth="4"/>}</g>}
 {['rotation','chest'].includes(e.motion)&&<circle cx={(p.hl[0]+p.hr[0])/2+(i===2?t*65:0)} cy={(p.hl[1]+p.hr[1])/2} r="16" fill="#9fb6c8" stroke="#6599c8" strokeWidth="2"/>}
 {e.motion==='rollout'&&<circle cx={p.hl[0]} cy={p.hl[1]+10} r="18" fill="#9fb6c8" stroke="#6599c8" strokeWidth="4"/>}
 {e.motion==='nordic'&&<path d="M323 372V402M318 380H355" stroke="#9fb6c8" strokeWidth="9"/>}
 </g></g>
 {!isRun&&!isJump&&<path d="M380 290Q420 230 380 210" fill="none" stroke="#6599c8" strokeWidth="2" markerEnd={`url(#${uid}arrow)`}/>}
 </svg>

 </div>
 <div className="animation-controls"><button className="pause-button" aria-pressed={!speed} onClick={()=>setSpeed(speed?0:1)}>{speed?'Ⅱ 일시정지':'▷ 재생'}</button></div>
 <div className="muscle-key"><p><span className="primary-dot"/>주동근 <span>{e.primary.join(' · ')}</span></p><p><span className="secondary-dot"/>보조근 <span>{e.secondary.filter(x=>!e.primary.includes(x)).join(' · ')||'자세 안정근'}</span></p></div>
 </section>
}
