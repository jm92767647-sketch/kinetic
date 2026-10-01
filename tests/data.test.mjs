import test from 'node:test';
import assert from 'node:assert/strict';
import {exercises,days,muscles,abilities,principles,trainingGroups,matchesTrainingGroup,regionMuscles} from '../src/data.js';
test('42 complete records with unique IDs and valid tags',()=>{
 assert.equal(exercises.length,42);assert.equal(new Set(exercises.map(e=>e.id)).size,42);
 for(const e of exercises){assert.ok(days[e.day]);for(const key of ['name','dose','rest','motion'])assert.ok(e[key],`${e.id}: ${key}`);for(const key of ['steps','progress','stop','cues','primary','regions','tags'])assert.ok(e[key].length,`${e.id}: ${key}`);for(const m of [...e.primary,...e.secondary])assert.ok(muscles.includes(m),m);for(const t of e.tags){assert.ok(abilities.includes(t),t);assert.ok(principles[t],t)}}
});
test('eight alternatives each reference a same-day original',()=>{
 const alternatives=exercises.filter(e=>e.parent);assert.equal(alternatives.length,8);
 for(const e of alternatives){const parent=exercises.find(p=>p.id===e.parent);assert.ok(parent);assert.equal(parent.parent,null);assert.equal(e.day,parent.day)}
});
test('all six days contain the requested original and alternative counts',()=>assert.deepEqual(days.map((_,i)=>exercises.filter(e=>e.day===i).length),[6,10,7,10,6,3]));
test('requested combined filter examples match',()=>{
 const lower=exercises.filter(e=>e.regions.includes('하체')&&e.primary.includes('햄스트링')&&e.tags.includes('감속')).map(e=>e.id);assert.ok(lower.includes('nordic'));assert.ok(lower.includes('decel'));
 const upper=exercises.filter(e=>e.regions.includes('상체')&&e.primary.includes('가슴')&&e.tags.some(t=>t.includes('파워'))).map(e=>e.id);assert.ok(upper.includes('chest'));assert.ok(upper.includes('explosive'));
});
test('five final ability filters preserve the requested memberships',()=>{
 assert.deepEqual(Object.keys(trainingGroups),['최대근력(근비대)','파워','감속','실제운동능력','근지구력']);
 const get=id=>exercises.find(e=>e.id===id);
 const membership={'최대근력(근비대)':['heavybulgarian','rdl','ohp','pullup','bench','heavyrow','calf','seatedcalf'],'파워':['split','scoop','press','explosivepull','explosive','explosiverow','swing','cmj','depth','lateral'],'감속':['reverse','nordic','decel','lateral'],'실제운동능력':['flying','decel','lateral','ankle','reach3','wristrock','external','bandface','hammer','ab','wristpress','thoracic','proney'],'근지구력':['interval','boxing','run']};
 for(const [group,ids] of Object.entries(membership))for(const id of ids)assert.ok(matchesTrainingGroup(get(id),group),id+': '+group);
 for(const e of exercises)assert.ok(Object.keys(trainingGroups).some(g=>matchesTrainingGroup(e,g)),e.id);
 for(const id of ['interval','boxing','run'])assert.ok(!matchesTrainingGroup(get(id),'실제운동능력'));
});
test('region subcategories contain valid, relevant muscles only',()=>{
 assert.deepEqual(Object.keys(regionMuscles),['상체','하체']);
 assert.ok(!regionMuscles['하체'].includes('가슴'));
 assert.ok(!regionMuscles['상체'].includes('햄스트링'));
 for(const [region,list] of Object.entries(regionMuscles)){
  for(const muscle of list){assert.ok(muscles.includes(muscle));assert.ok(exercises.some(e=>e.regions.includes(region)&&[...e.primary,...e.secondary].includes(muscle)),region+': '+muscle)}
 }
});

test('six-day exercise order and alternative relationships',()=>{
 assert.deepEqual(days,['하체 전면','상체 수직','운동능력','상체 수평','하체 후면','근지구력']);
 const order=[['ankle','reach3','split','heavybulgarian','reverse'],['wristrock','scoop','press','explosivepull','ohp','pullup','bandface','hammer'],['flying','decel','cmj','lateral','calf','seatedcalf'],['external','explosive','explosiverow','bench','heavyrow','ab','wristpress'],['swing','rdl','nordic','thoracic','proney'],['interval','boxing','run']];
 for(let day=0;day<6;day++)assert.deepEqual(exercises.filter(e=>e.day===day&&!e.parent).map(e=>e.id),order[day]);
 assert.deepEqual(Object.fromEntries(exercises.filter(e=>e.parent).map(e=>[e.id,e.parent])),{front:'heavybulgarian',rotation:'scoop',pike:'ohp',depth:'cmj',bandexternal:'external',chest:'explosive',hardpush:'bench',trap:'rdl'});
 assert.ok(!exercises.some(e=>e.id==='pistol'||e.parent==='press'||e.parent==='pullup'));
 assert.deepEqual(exercises.find(e=>e.id==='pike').tags,['최대근력']);
});

test('updated reach, forearms, advanced depth option and excluded jumps',()=>{
 const get=id=>exercises.find(e=>e.id===id);
 assert.equal(get('reach3').name,'Single-leg 8-Direction Reach');assert.equal(get('reach3').directions.length,8);assert.equal(get('reach3').dose,'8방향 × 각 1회 × 2라운드/발');
 assert.equal(get('depth').relation,'advanced');
 assert.ok(!exercises.some(e=>['trapjump','dbjump','face'].includes(e.id)));
 for(const id of ['wristrock','hammer','wristpress'])assert.ok(get(id).primary.includes('전완·손목'));
 for(const e of exercises)for(const region of e.regions)assert.ok(['상체','하체'].includes(region));
});
