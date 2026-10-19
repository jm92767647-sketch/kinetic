// Precise guides for motions that do not have a matching source clip.
// Coordinates use the existing Anatomy / MuscleFigure joint system.
const pose=(h,s,p,el,hl,er,hr,kl,fl,kr,fr)=>({h,s,p,el,hl,er,hr,kl,fl,kr,fr});
export const correctedExerciseIds=['ankle','reach3','wristrock','wristpress','thoracic','proney'];
export const reachDirections=['앞','뒤','좌','우','앞왼쪽 대각','앞오른쪽 대각','뒤왼쪽 대각','뒤오른쪽 대각'];
export const reachTargets=[[218,419],[218,355],[138,391],[347,391],[151,412],[317,412],[151,362],[317,362]];
const balance=pose([245,108],[245,148],[245,258],[177,175],[128,186],[313,175],[362,186],[224,326],[218,393],[286,323],[287,370]);
const reachFrames=[balance,...reachTargets.flatMap(fr=>[{
 ...balance,h:[242,123],s:[242,163],p:[241,271],kl:[222,330],kr:[(255+fr[0])/2,330],fr,
},balance])];
// Front foot stays planted. Only the tibia advances over the foot.
const ankle=pose([245,157],[245,197],[291,277],[208,230],[177,285],[256,237],[187,291],[185,316],[203,393],[316,345],[361,393]);
const ankleEnd={...ankle,h:[217,166],s:[217,206],p:[275,285],kl:[159,324],el:[184,239],hl:[164,295],er:[231,245],hr:[177,299]};
const quadruped=pose([147,245],[185,274],[298,278],[185,330],[185,385],[219,330],[219,385],[311,375],[371,395],[337,375],[397,395]);
const wristLean={...quadruped,h:[126,245],s:[164,274],p:[277,278],el:[175,329],er:[204,329]};
// Palm heel rises; fingertip contact coordinates stay fixed (drawn in Anatomy).
const palmRaised={...quadruped,h:[147,235],s:[185,264],p:[298,274],el:[185,320],hl:[185,371],er:[219,320],hr:[219,371]};
const thoracic=pose([190,290],[221,307],[330,327],[198,347],[183,391],[230,300],[208,302],[332,378],[374,395],[353,378],[395,395]);
const thoracicOpen={...thoracic,h:[203,266],s:[232,288],er:[275,237],hr:[221,278]};
const prone=pose([138,366],[180,376],[286,380],[182,351],[138,331],[219,337],[174,312],[352,385],[415,391],[353,365],[421,369]);
const armPositions={W:{el:[182,351],hl:[138,331],er:[219,337],hr:[174,312]},T:{el:[155,363],hl:[129,315],er:[207,356],hr:[250,322]},Y:{el:[129,352],hl:[78,331],er:[154,318],hr:[115,273]}};
export function proneFrames(stage='W'){
 const rest={...prone,...armPositions[stage]};
 const brace={...rest,h:[138,347],s:[180,358]};
 const lift={...brace,...Object.fromEntries(['el','hl','er','hr'].map(k=>[k,[rest[k][0],rest[k][1]-22]]))};
 return [rest,brace,lift,lift,brace,rest,rest];
}
export const correctedFrames={
 ankle:[ankle,ankleEnd,ankleEnd,ankle,ankle],
 reach8:reachFrames,
 wristrock:[quadruped,wristLean,quadruped,quadruped,wristLean,quadruped,quadruped,wristLean,quadruped,quadruped,wristLean,quadruped,quadruped],
 wristpress:[quadruped,palmRaised,palmRaised,quadruped,quadruped],
 thoracic:[thoracic,thoracicOpen,thoracicOpen,thoracic,thoracic],
};
export const correctedNotes={
 ankle:'뒤꿈치와 발 앞부분을 고정한 채 앞무릎만 발끝 방향으로 전진합니다. 끝범위에서 돌아옵니다.',
 reach3:'지지발은 고정하고 반대발로 앞·뒤·좌·우와 네 대각선을 가볍게 터치합니다. 뒤쪽과 옆 아래 방향까지 제어합니다.',
 wristrock:'손가락을 앞·안쪽·바깥쪽·몸쪽으로 돌려 놓고 체중을 손 위로 천천히 옮깁니다. 통증 없는 작은 범위에서 수행합니다.',
 wristpress:'손가락은 계속 바닥을 지지하고 손바닥 밑부분만 들어 올렸다 내립니다. 팔꿈치를 굽히는 푸쉬업과 구분합니다. 무릎 지지부터 시작합니다.',
 thoracic:'한 손은 바닥을 지지하고 반대손은 뒷목에 둡니다. 손을 뻗지 않고 가슴과 팔꿈치를 함께 회전합니다.',
 proney:'복부를 단단히 유지하고 가슴 윗부분을 먼저 살짝 띄운 뒤 팔을 들어 올립니다. 허리를 과하게 꺾지 않습니다. W → T → Y 중 맞는 단계를 선택합니다.',
};
