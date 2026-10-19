import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {exercises} from '../src/data.js';
import {exerciseMedia} from '../src/exerciseMedia.js';

test('every exercise and alternative has a local moving clip and poster',()=>{
 assert.deepEqual(Object.keys(exerciseMedia).sort(),exercises.map(e=>e.id).sort());
 for(const e of exercises){
  const media=exerciseMedia[e.id];assert.ok(media.variants.length,e.id);
  for(const v of media.variants){
   assert.match(v.src,/^media\/exercises\/[a-zA-Z0-9-]+\.mp4$/);
   const file=new URL('../public/'+v.src,import.meta.url);
   assert.ok(statSync(file).size>1000,e.id);
   assert.equal(readFileSync(file).subarray(4,8).toString(),'ftyp',e.id);
   const poster=readFileSync(new URL('../public/'+v.poster,import.meta.url));
   assert.equal(poster.subarray(8,12).toString(),'WEBP',e.id);
   assert.ok(['SmartWorkout','Lyfta'].includes(v.provider),e.id);
   assert.ok(['smartworkout.app','www.lyfta.app','lyfta.app'].includes(new URL(v.source).hostname),e.id);
  }
 }
});

test('requested clip choices and progression directions are preserved',()=>{
 assert.equal(exerciseMedia.decel.variants[0].src,exerciseMedia.flying.variants[0].src);
 assert.equal(exerciseMedia.bench.variants[0].sourceExercise,'One-Arm Dumbbell Bench Press');
 assert.equal(exerciseMedia.explosive.variants[0].originalVideo,'https://api.smartworkout.app/asset/video/3eee6526-9f25-4102-be30-39d783599365.mp4');
 assert.deepEqual(exerciseMedia.hammer.variants.map(v=>v.label),['회내','회외']);
 assert.deepEqual(exerciseMedia.proney.variants.map(v=>v.label),['W','T','Y']);
 for(const id of ['ankle','reach3','wristrock','explosivepull','decel','explosiverow','wristpress','thoracic'])assert.ok(exerciseMedia[id].note,id);
});
