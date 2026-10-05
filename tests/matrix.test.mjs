import test from 'node:test';
import assert from 'node:assert/strict';
import {exercises} from '../src/data.js';
import {matrixColumns,matrixRows} from '../src/programMatrix.js';
test('matrix mappings reference current exercise records and valid main/alternative relationships',()=>{
 const byId=new Map(exercises.map(e=>[e.id,e]));
 assert.equal(matrixColumns.flatMap(g=>g.names).length,8);
 assert.equal(matrixRows.length,6);
 for(const row of matrixRows){
  assert.equal(row.cells.reduce((sum,c)=>sum+c.span,0),8,row.name);
  for(const c of row.cells)for(const entry of c.entries){
   assert.ok(byId.has(entry.id),entry.id);
   if(entry.alternatives){assert.equal(byId.get(entry.id).parent,null);assert.ok(exercises.some(e=>e.parent===entry.id&&e.relation!=='advanced'))}
  }
 }
 const depth=byId.get('depth');assert.equal(depth.parent,'cmj');assert.equal(depth.relation,'advanced');
 assert.equal(byId.get('reach3').directions.length,8);
});
