import React from 'react';
import {exercises,strengthBlock} from './data';
import {matrixColumns,matrixRows} from './programMatrix.js';

const byId=Object.fromEntries(exercises.map(e=>[e.id,e]));
function MatrixExercise({entry,showDose=false}){
 const e=byId[entry.id];
 const alternatives=entry.alternatives?exercises.filter(x=>x.parent===e.id&&x.relation!=='advanced'):[];
 return <div className="matrix-exercise">
  <span className="matrix-exercise-name">{e.name}</span>
  {entry.role&&<small>{entry.role}</small>}
  {showDose&&<small>{e.dose}</small>}
  {entry.id==='interval'&&<small>반복 사이 20~30초 · 세트 사이 2~3분</small>}
  {entry.id==='reach3'&&<small>{e.directions.join(' · ')}</small>}
  {alternatives.map(a=><div key={a.id} className="matrix-alternative"><span aria-hidden="true">↓</span> 대체: {a.name}</div>)}
 </div>;
}
export default function ProgramMatrix(){return <main className="program-matrix">
 <div className="matrix-intro"><h1>구성표</h1><p>부위와 훈련 요소로 보는 전체 프로그램</p><small>모바일에서는 표를 좌우로 스크롤해 보세요.</small></div>
 <div className="matrix-scroll" role="region" aria-label="운동 구성표 가로 스크롤" tabIndex={0}>
  <table className="matrix-table">
   <caption>운동 구성 매트릭스 · 상체와 하체의 8개 부위 / 6개 훈련 요소</caption>
   <colgroup><col className="matrix-label-column"/>{matrixColumns.flatMap(g=>g.names).map(n=><col key={n}/>)}</colgroup>
   <thead><tr><th rowSpan={2} scope="col" className="matrix-row-label">훈련 요소</th>{matrixColumns.map(g=><th key={g.group} colSpan={g.names.length} scope="colgroup">{g.group}</th>)}</tr>
    <tr>{matrixColumns.flatMap(g=>g.names).map(n=><th key={n} scope="col">{n}</th>)}</tr></thead>
   <tbody>{matrixRows.map(row=><tr key={row.name}><th scope="row" className="matrix-row-label">{row.name==='최대근력(근비대)'?<>최대근력<wbr/>(근비대)</>:row.name}</th>{row.cells.map((c,i)=><td key={i} colSpan={c.span}>
    {c.title&&<h2>{c.title}</h2>}
    <div className={c.span>1?'matrix-entries merged':'matrix-entries'}>{c.entries.map(entry=><MatrixExercise key={entry.id} entry={entry} showDose={row.name==='근지구력'}/>)}</div>
    {c.note&&<p className="matrix-cell-note">{c.note}</p>}
   </td>)}</tr>)}</tbody>
  </table>
 </div>
 <p className="matrix-footnote">{strengthBlock}</p>
</main>}
