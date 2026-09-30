import React from 'react';

// Original articulated SVG anatomy, inspired by the supplied front/back muscle atlas.
// Every muscle shape moves in the local coordinate system of its anatomical segment.
export default function MuscleFigure({points:p,exercise:e,handTurn=0,handBack=false}){
 const base='#639dd9',primary='#e34c54',secondary='#ef9b45',seam='#e6f2ff',outline='#4d83b5';
 const fill=tags=>tags.includes('전완')&&e.highlightForearms?primary:tags.some(t=>e.primary.includes(t))?primary:tags.some(t=>e.secondary.includes(t))?secondary:base;
 const back=['nordic','rdl','pullup','face','bandface','proney','thoracic'].includes(e.motion);
 const dx=p.p[0]-p.s[0],dy=p.p[1]-p.s[1],length=Math.hypot(dx,dy)||1;
 const normal=[dy/length,-dx/length];
 const offset=(point,n)=>[point[0]+normal[0]*n,point[1]+normal[1]*n];
 const shoulderL=offset(p.s,-26),shoulderR=offset(p.s,26),hipL=offset(p.p,-14),hipR=offset(p.p,14);
 const transform=(a,b)=>`translate(${a}) rotate(${Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI-90}) scale(1 ${Math.hypot(b[0]-a[0],b[1]-a[1])/100})`;
 const muscle=(d,tags,key)=><path key={key} d={d} fill={fill(tags)} stroke={seam} strokeWidth="1.15" strokeLinejoin="round"/>;
 function segment(a,b,type,key){return <g key={key} transform={transform(a,b)} data-segment={type}>
  {type==='arm'&&<>
   <path d="M-9 0Q-18 12-13 40L-7 92Q0 105 7 92L13 39Q18 12 9 0Z" fill={base} stroke={outline} strokeWidth=".7"/>
   {muscle('M-9 6Q-18 16-11 39Q-4 42-1 18L0 3Z',back?['후면어깨·견갑','회전근개']:['어깨'], 'deltoid')}
   {muscle('M1 4Q15 4 13 24Q10 34 5 40L-1 25Z',['어깨'],'delt-side')}
   {muscle('M-8 36Q-14 55-6 79L-1 94Q3 66 0 37Z',back?['삼두']:['이두'],'upper-medial')}
   {muscle('M3 34Q14 32 10 65L4 92L1 73Z',['삼두'],'upper-lateral')}
   <path d="M-5 93Q0 97 5 93" fill="none" stroke={seam}/>
  </>}
  {type==='forearm'&&<>
   <path d="M-7 0Q-14 18-9 43L-4 97Q0 102 4 97L9 44Q14 18 7 0Z" fill={base} stroke={outline} strokeWidth=".7"/>
   {muscle('M-6 5Q-12 24-7 45L-1 90L0 38Z',['전완'],'flexor')}
   {muscle('M4 3Q12 15 8 41L2 91L1 35Z',['전완'],'extensor')}
   <path d="M-2 48L-1 94M5 44L2 95" fill="none" stroke={seam} strokeWidth=".9"/>
  </>}
  {type==='thigh'&&<>
   <path d="M-11-4Q-24 12-20 43Q-18 66-8 94Q0 104 8 94Q18 66 20 43Q24 12 11-4Z" fill={base} stroke={outline} strokeWidth=".7"/>
   {muscle('M-11 3Q-24 28-13 63L-5 88Q-9 51-3 16Z',back?['햄스트링']:['대퇴사두근'],'vastus-lateral')}
   {muscle('M-1 7Q8-1 12 15Q16 43 4 80L0 91Q-4 58-1 7Z',back?['햄스트링']:['대퇴사두근'],'rectus')}
   {muscle('M15 21Q24 38 14 70Q15 89 6 91L4 83Z',back?['햄스트링']:['대퇴사두근'],'vastus-medial')}
   {muscle('M-8-1L8-1L13 14L3 38Z',['중둔근·내전근'],'adductor')}
   <path d="M-8 9Q-1 35 7 59L8 86M-5 95Q0 98 5 95" fill="none" stroke={seam} strokeWidth="1"/>
  </>}
  {type==='calf'&&<>
   <path d="M-7 0Q-18 17-13 46L-5 89L-4 100H4L5 89L13 46Q18 17 7 0Z" fill={base} stroke={outline} strokeWidth=".7"/>
   {muscle('M-6 4Q-17 18-11 43Q-9 52-4 55L-1 86L-2 29Z',['종아리·발목'],'gastrocnemius-l')}
   {muscle('M5 4Q16 18 11 42Q9 56 3 56L1 87L1 31Z',['종아리·발목'],'gastrocnemius-r')}
   <path d="M-1 60V98M3 59L1 98" fill="none" stroke={seam} strokeWidth="1"/>
  </>}
 </g>}
 function arm(side){
  const s=side==='l'?shoulderL:shoulderR,hand=p[side==='l'?'hl':'hr'];
  // Keep the upper arm and forearm proportionate even when the hands approach the chest.
  const vx=hand[0]-s[0],vy=hand[1]-s[1],distance=Math.hypot(vx,vy)||.001;
  const bone=Math.max(52,distance/2+.01),height=Math.sqrt(Math.max(0,bone*bone-distance*distance/4));
  const middle=[(s[0]+hand[0])/2,(s[1]+hand[1])/2];
  const candidates=[1,-1].map(sign=>[middle[0]+sign*vy/distance*height,middle[1]-sign*vx/distance*height]);
  const outward=side==='l'?-1:1;const score=q=>outward*((q[0]-s[0])*normal[0]+(q[1]-s[1])*normal[1]);const el=e.explicitElbows?p[side==='l'?'el':'er']:score(candidates[0])>=score(candidates[1])?candidates[0]:candidates[1];
  return <g key={'arm-'+side}>{segment(s,el,'arm',side+'a')}{segment(el,hand,'forearm',side+'f')}<g transform={`translate(${hand}) rotate(${Math.atan2(hand[1]-el[1],hand[0]-el[0])*180/Math.PI-90+(side==='l'?handTurn:0)}) scale(${handBack?-1:1} 1)`}><path d="M-4-3L-7 2L-10 6Q-11 9-8 9L-5 7L-4 18Q-2 21-1 18L0 9L1 21Q3 22 3 19L3 9L5 19Q7 20 7 17L6 6L6-2Z" fill="#80b3e7" stroke={outline} strokeWidth=".6"/></g></g>
 }
 function leg(side){const hip=side==='l'?hipL:hipR,knee=p[side==='l'?'kl':'kr'],foot=p[side==='l'?'fl':'fr'];return <g key={'leg-'+side}>{segment(hip,knee,'thigh',side+'t')}{segment(knee,foot,'calf',side+'c')}<path d={`M${foot[0]-5} ${foot[1]-6}q5 1 9 5l12 4q5 5-1 7h-22q-4-1-3-6Z`} fill="#80b3e7" stroke={outline} strokeWidth=".7"/></g>}
 return <g className="muscle-figure" data-anatomy-view={back?'posterior':'anterior'}>
  {leg('r')}{leg('l')}
  <g transform={transform(p.s,p.p)}>
   <path d="M-8-14L-12-4Q-24-1-30 9Q-30 23-23 40L-17 61Q-16 77-23 94Q-15 110 0 110Q15 110 23 94Q16 77 17 61L23 40Q30 23 30 9Q24-1 12-4L8-14Z" fill={base} stroke={outline} strokeWidth=".8"/>
   {back?<>
    {[-1,1].map(sign=><g key={sign} transform={`scale(${sign} 1)`}>
     {muscle('M2-11L9-9Q12-1 26 5L11 27L2 44Z',['등','후면어깨·견갑'],'trap')}
     {muscle('M12 13Q30 5 27 29L13 39L7 27Z',['후면어깨·견갑','회전근개'],'scapula')}
     {muscle('M27 31Q26 50 17 71L4 84L3 46Z',['광배근'],'lat')}
     {muscle('M3 49L10 64L12 82L3 89Z',['등','코어'],'erectors')}
     {muscle('M4 88Q16 80 23 94Q24 108 14 115Q3 117 2 109Z',['둔근'],'glute')}
    </g>)}
    <path d="M0-12V109" stroke={seam} strokeWidth="2"/>
   </>:<>
    {[-1,1].map(sign=><g key={sign} transform={`scale(${sign} 1)`}>
     {muscle('M2 8Q12 0 25 7Q30 18 21 30Q10 36 2 29Z',['가슴'],'pectoral')}
     {[36,49,62,75].map((y,j)=>muscle(`M2 ${y}Q7 ${y-3} 11 ${y+1}L12 ${y+9}Q7 ${y+12} 2 ${y+9}Z`,['코어'],'ab'+j))}
     {muscle('M16 39L23 33L21 57L14 79L13 62Z',['코어'],'oblique')}
     {[31,38,45].map((y,j)=><path key={j} d={`M25 ${y}L19 ${y+5}L15 ${y+3}`} fill="none" stroke={seam} strokeWidth="1.2"/>)}
     {muscle('M13 85L21 80L25 99L16 108L7 99Z',['둔근','중둔근·내전근'],'hip')}
     {muscle('M2 89L10 90L7 105L2 110Z',['코어'],'lower-ab')}
    </g>)}
    <path d="M0 7V110M-8-10L-2 7M8-10L2 7" fill="none" stroke={seam} strokeWidth="1.4"/>
   </>}
  </g>
  {arm('r')}{arm('l')}
  <path d={`M${p.s}L${p.h}`} stroke="#77ade2" strokeWidth="14"/>
  <g transform={`translate(${p.h[0]} ${p.h[1]-5})`}><path d="M-16-9Q-16-25 0-26Q16-25 16-9L17-1L20 0L18 10L15 10Q12 25 0 28Q-12 25-15 10L-18 10L-20 0L-17-1Z" fill="#8bbbea" stroke={outline} strokeWidth=".7"/>{!back&&<path d="M-8 14Q0 18 8 14" fill="none" stroke="#6194c4" strokeWidth=".65"/>}</g>
 </g>;
}

