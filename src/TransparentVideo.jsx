import React,{useEffect,useRef,useState} from 'react';

// A single H.264 stream stores color above its alpha mask. This also works on
// mobile browsers that decode VP9 but discard the WebM alpha channel.
export default function TransparentVideo({videoRef,src,poster,label,...events}){
 const canvasRef=useRef(null),[ready,setReady]=useState(false);
 useEffect(()=>{
  const video=videoRef.current,canvas=canvasRef.current;
  const context=canvas.getContext('2d',{willReadFrequently:true});
  const mask=document.createElement('canvas'),maskContext=mask.getContext('2d',{willReadFrequently:true});
  let stopped=false,handle,last=-1;
  setReady(false);
  const draw=()=>{
   if(stopped||video.readyState<2||!video.videoWidth)return;
   const w=video.videoWidth,h=video.videoHeight/2;
   if(canvas.width!==w||canvas.height!==h){canvas.width=mask.width=w;canvas.height=mask.height=h;}
   context.drawImage(video,0,0,w,h,0,0,w,h);
   maskContext.drawImage(video,0,h,w,h,0,0,w,h);
   const pixels=context.getImageData(0,0,w,h),alpha=maskContext.getImageData(0,0,w,h).data;
   for(let i=0;i<pixels.data.length;i+=4){const a=alpha[i];pixels.data[i+3]=a<8?0:a>247?255:a;}
   context.putImageData(pixels,0,0);setReady(true);
  };
  const tick=()=>{
   if(stopped)return;
   if(video.requestVideoFrameCallback){draw();handle=video.requestVideoFrameCallback(tick);}
   else {if(!video.paused&&Math.abs(video.currentTime-last)>.04){draw();last=video.currentTime;}handle=requestAnimationFrame(tick);}
  };
  video.addEventListener('loadeddata',draw);video.addEventListener('seeked',draw);
  if(video.requestVideoFrameCallback)handle=video.requestVideoFrameCallback(tick);else handle=requestAnimationFrame(tick);
  draw();
  return()=>{stopped=true;video.removeEventListener('loadeddata',draw);video.removeEventListener('seeked',draw);if(video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(handle);else cancelAnimationFrame(handle);};
 },[src,videoRef]);
 return <>
  <video ref={videoRef} src={src} muted loop playsInline preload="auto" {...events} aria-hidden="true" style={{position:'absolute',width:1,height:1,opacity:.01,pointerEvents:'none'}}/>
  {!ready&&<img src={poster} className="exercise-video" alt={label}/>}
  <canvas ref={canvasRef} className="exercise-video" role="img" aria-label={label} style={{display:ready?'block':'none'}}/>
 </>;
}
