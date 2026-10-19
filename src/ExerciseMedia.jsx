import React,{useEffect,useRef,useState} from 'react';
import Anatomy from './Anatomy';
import {exerciseMedia} from './exerciseMedia.js';
import {correctedExerciseIds} from './correctedMotions.js';
import TransparentVideo from './TransparentVideo.jsx';

const assetUrl=path=>`${import.meta.env.BASE_URL}${path}?v=reference-20261019-7`;

export default function ExerciseMedia({exercise:e}){
 const [variantIndex,setVariantIndex]=useState(0);
 const [paused,setPaused]=useState(()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [failed,setFailed]=useState(false);
 const videoRef=useRef(null);
 const media=exerciseMedia[e.id];
 const variant=media?.variants[variantIndex];

 useEffect(()=>{
  const video=videoRef.current;
  if(!video||failed)return;
  if(paused)video.pause();
  else video.play().catch(()=>setPaused(true));
 },[variant?.src,paused,failed]);

 if(correctedExerciseIds.includes(e.id))return <Anatomy exercise={e} corrected/>;
 if(!variant||failed)return <>
  {failed&&<p className="media-fallback" role="status">영상을 불러오지 못해 기존 동작 가이드를 표시합니다. <button onClick={()=>setFailed(false)}>다시 시도</button></p>}
  <Anatomy exercise={e}/>
 </>;

 const toggle=()=>{
  const video=videoRef.current;
  if(!video)return;
  if(video.paused)video.play().catch(()=>setPaused(true));
  else video.pause();
 };

 return <section className="movement">
  <h1 className="movement-heading">{e.name}</h1>
  <div className="exercise-media-stage" style={{position:'relative'}}>
   <TransparentVideo key={variant.src} videoRef={videoRef} src={assetUrl(variant.src.replace(/\.webm$/,'-packed.mp4'))} poster={assetUrl(variant.poster)} label={`${e.name} · ${variant.sourceExercise} 동작 영상`} autoPlay={!paused} onPlay={()=>setPaused(false)} onPause={()=>setPaused(true)} onError={()=>setFailed(true)}/>
  </div>
  <div className="animation-controls">
   <button className="pause-button" onClick={toggle} aria-pressed={paused}>{paused?'▷ 재생':'Ⅱ 일시정지'}</button>
  </div>
  {media.variants.length>1&&<div className="media-variants" role="group" aria-label="동작 단계 선택">{media.variants.map((v,i)=><button key={v.src} className={variantIndex===i?'active':''} aria-pressed={variantIndex===i} onClick={()=>setVariantIndex(i)}>{v.label}</button>)}</div>}
  <div className="muscle-key"><p><span className="primary-dot"/>주동근 <span>{e.primary.join(' · ')}</span></p><p><span className="secondary-dot"/>보조근 <span>{e.secondary.join(' · ')}</span></p></div>
  {media.note&&<p className="media-reference-note">{media.note}</p>}
  <p className="media-source"><a href={variant.source} target="_blank" rel="noopener noreferrer">{variant.provider} · {variant.sourceExercise} ↗</a></p>
 </section>;
}
