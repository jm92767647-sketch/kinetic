import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {exercises} from '../src/data.js';
import {exerciseMedia} from '../src/exerciseMedia.js';
import {correctedExerciseIds,correctedFrames,proneFrames} from '../src/correctedMotions.js';

test('every exercise has either a corrected joint guide or a transparent local clip',()=>{
 assert.deepEqual(Object.keys(exerciseMedia).sort(),exercises.map(e=>e.id).sort());
 for(const e of exercises){
  const media=exerciseMedia[e.id];assert.ok(media.variants.length,e.id);
  if(correctedExerciseIds.includes(e.id))continue;
  for(const v of media.variants){
   assert.match(v.src,/^media\/exercises\/[a-zA-Z0-9-]+\.webm$/);
   const file=new URL('../public/'+v.src,import.meta.url);
   assert.ok(statSync(file).size>1000,e.id);
   const bytes=readFileSync(file);
   assert.equal(bytes.subarray(0,4).toString('hex'),'1a45dfa3',e.id);
   assert.ok(bytes.includes(Buffer.from([0x53,0xc0,0x81,0x01])),e.id+' WebM alpha mode');
   const poster=readFileSync(new URL('../public/'+v.poster,import.meta.url));
   assert.equal(poster.subarray(8,12).toString(),'WEBP',e.id);
   assert.ok(['SmartWorkout','Lyfta'].includes(v.provider),e.id);
   assert.ok(['smartworkout.app','www.lyfta.app','lyfta.app'].includes(new URL(v.source).hostname),e.id);
  }
 }
});

test('corrected guides keep contact points fixed and sequence torso before arms',()=>{
 const ankle=correctedFrames.ankle;
 for(const p of ankle)assert.deepEqual(p.fl,ankle[0].fl,'Knee-to-Wall front heel remains fixed');
 assert.ok(ankle[1].kl[0]<ankle[0].kl[0],'knee advances');
 const reach=correctedFrames.reach8;
 for(const p of reach)assert.deepEqual(p.fl,reach[0].fl,'support foot remains fixed');
 assert.equal(new Set(reach.filter((_,i)=>i%2===1).map(p=>p.fr.join(','))).size,8);
 for(const p of correctedFrames.thoracic)assert.ok(Math.hypot(p.hr[0]-p.h[0],p.hr[1]-p.h[1])<28,'hand stays at back of neck');
 for(const stage of ['W','T','Y']){
  const [rest,brace,arms]=proneFrames(stage);
  assert.ok(brace.s[1]<rest.s[1],'upper chest lifts first');
  assert.deepEqual(brace.hl,rest.hl,'arms do not lift during initial brace');
  assert.deepEqual(arms.s,brace.s,'torso held steady during arm lift');
  assert.ok(arms.hl[1]<brace.hl[1],'arms then lift');
 }
 assert.ok(correctedFrames.wristpress[1].hl[1]<correctedFrames.wristpress[0].hl[1],'palm heel rises');
});

test('requested clip choices and progression directions are preserved',()=>{
 assert.equal(exerciseMedia.decel.variants[0].src,exerciseMedia.flying.variants[0].src);
 assert.equal(exerciseMedia.bench.variants[0].sourceExercise,'One-Arm Dumbbell Bench Press');
 assert.equal(exerciseMedia.explosive.variants[0].originalVideo,'https://api.smartworkout.app/asset/video/3eee6526-9f25-4102-be30-39d783599365.mp4');
 assert.deepEqual(exerciseMedia.hammer.variants.map(v=>v.label),['회내','회외']);
 assert.deepEqual(exerciseMedia.proney.variants.map(v=>v.label),['W','T','Y']);
 for(const id of ['ankle','reach3','wristrock','explosivepull','decel','explosiverow','wristpress','thoracic'])assert.ok(exerciseMedia[id].note,id);
});
