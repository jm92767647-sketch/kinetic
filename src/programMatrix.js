// Overview roles reference existing exercise IDs; prescriptions stay in data.js.
const exercise=(id,role='',alternatives=false)=>({id,role,alternatives});
const cell=(entries=[],note='',title='',span=1)=>({entries,note,title,span});
export const matrixColumns=[
 {group:'상체',names:['가슴','어깨','등 · 수직당김','등 · 수평당김']},
 {group:'하체',names:['대퇴사두','햄스트링','둔근','종아리']},
];
export const matrixRows=[
 {name:'최대근력(근비대)',cells:[
  cell([exercise('bench','',true)]),cell([exercise('ohp','',true)]),
  cell([exercise('pullup','맨몸 Pull-up → 능력 향상 시 추가중량')]),cell([exercise('heavyrow')]),
  cell([exercise('heavybulgarian','',true)]),cell([exercise('rdl','',true)]),
  cell([exercise('heavybulgarian'),exercise('rdl')],'두 운동에서 함께 최대근력 훈련'),
  cell([exercise('calf'),exercise('seatedcalf')]),
 ]},
 {name:'감속',cells:[
  cell([],'기존 최대근력 운동의 통제된 하강 + 견갑·회전근개 안정화로 기초 편심·제어 능력 훈련','상체 기초 제어',4),
  cell([exercise('reverse'),exercise('decel'),exercise('lateral')],'실제 감속에서 함께 참여'),
  cell([exercise('nordic'),exercise('decel')],'Sprint의 고속 움직임과 실제 감속에 참여'),
  cell([exercise('decel'),exercise('lateral'),exercise('cmj','착지 제어')],'Bulgarian / RDL의 통제된 편심 하강'),
  cell([exercise('decel'),exercise('cmj','착지'),exercise('lateral')],'Calf Raise의 통제된 하강'),
 ]},
 {name:'파워',cells:[
  cell([exercise('explosive','',true)]),cell([exercise('press')]),
  cell([exercise('explosivepull')]),cell([exercise('explosiverow')]),
  cell([exercise('split'),exercise('cmj')],'CMJ에서도 강하게 사용'),
  cell([exercise('swing'),exercise('flying','Sprint에서 빠른 힘 발휘')]),
  cell([exercise('split'),exercise('swing'),exercise('cmj'),exercise('flying')],'여러 움직임에서 함께 강하게 사용'),
  cell([exercise('cmj'),exercise('depth','CMJ 이후 고급 단계 · 동시 필수 수행 아님'),exercise('flying'),exercise('lateral')],'폭발적인 발목 힘'),
 ]},
 {name:'실제 운동능력',cells:[
  cell([exercise('scoop','회전 파워 · 하체 → 골반 → 몸통 → 팔 힘 전달'),exercise('ab','코어 안정성 / Anti-extension')],'','상체 / 전신 힘 전달',4),
  cell([exercise('flying','최고속도'),exercise('decel','최대가속 + 직선 감속'),exercise('lateral','측면 파워 + 감속 + 방향전환'),exercise('cmj','양발 수직 파워'),exercise('depth','CMJ 이후 고급 탄성 / 반응성 단계 · 선택 수행')],'','하체 스포츠 움직임',4),
 ]},
 {name:'근지구력',cells:[
  cell([exercise('boxing','상체/전신 반복 고출력 · 복싱 특이적 근지구력 · 심폐 및 반복 펀치 능력')],'','상체 / 전신',4),
  cell([exercise('interval','하체 반복 고출력 / Sprint 반복 능력'),exercise('run','전신 지구력 · A주 40~60분 / B주 50~90분 · 편안한 대화 강도')],'Interval과 Long Run은 가능하면 몇 시간 분리. 같은 세션이면 Interval 먼저 → Long Run 나중.','하체 반복 출력 / 전신 지구력',4),
 ]},
 {name:'관절 안정성 · 가동성 · 자세',cells:[
  cell([
   exercise('wristrock','손목 / 전완 가동성'),exercise('wristpress','손목 부하내성'),exercise('hammer','전완 회내 + 회외'),
   exercise('bandface','어깨 / 견갑 안정'),exercise('external','회전근개 활성화'),
   exercise('thoracic','자세 / 흉추 회전'),exercise('proney','자세 / 흉추 신전 · W → T → Y'),
  ],'','상체 관절 제어 / 자세',4),
  cell([exercise('ankle','체중부하 발목 배굴'),exercise('reach3','한발 균형 · 발목 안정 · 고유수용감각')],'','발목 / 균형',4),
 ]},
];
