# KINETIC · 나의 퍼포먼스 가이드

서버·로그인 없이 동작하는 Vite + React 정적 웹앱입니다. 5개 데이, 22개 기본/선택 운동과 9개 대체운동, 총 31개 운동을 포함합니다.

## 실행

Node.js 22.12 이상을 설치한 뒤 이 폴더에서 실행합니다.

```sh
npm install
npm run dev
```

또는 pnpm 10에서 `pnpm install`, `pnpm dev`를 사용합니다. 배포 빌드는 `npm run build`, 빌드 미리보기는 `npm run preview`입니다. `dist/index.html`을 파일로 직접 열지 말고 미리보기 서버 또는 정적 호스팅으로 사용하세요.

## 구조

```text
kinetic/
├── src/
│   ├── data.js          # 모든 운동·분류·발전 원칙 데이터
│   ├── Anatomy.jsx      # 동작 키프레임과 재생
│   ├── MuscleFigure.jsx # 근육 윤곽·전후면·분절 인체 그림
│   ├── main.jsx         # 탐색·필터·상세·대체운동 카드
│   └── styles.css       # 연한 하늘색 테마와 반응형 레이아웃
├── .github/workflows/deploy.yml  # GitHub Pages 배포
├── index.html
├── vite.config.js      # 상대경로 base: './'
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── dist/               # 생성된 배포 파일
```

## 운동 정보를 수정하려면

**`src/data.js`만 수정하면 됩니다.** `exercises` 배열에서 운동 이름을 검색하세요. 각 운동은 이름 붙은 필드를 가진 객체입니다.

| 필드 | 의미 / 예시 |
|---|---|
| `id` | 중복되지 않는 식별자, `split` |
| `day` | 0: 하체, 1: 상체, 2: 감속·인터벌, 3: 최고속도, 4: 지구력 |
| `name` | 화면에 표시할 운동명 |
| `tags` | 훈련능력 배열. 상단 `abilities`의 값 사용 |
| `regions` | 하체 / 상체 / 코어 / 전신 배열 |
| `primary` / `secondary` | 주동근 / 보조근. 상단 `muscles`의 이름과 일치 |
| `muscleDetail` | 선택 항목. 극하근·소원근 등 세부 설명 |
| `dose` | `3세트 × 3회/다리` 등 기본 운동량 |
| `rest` | 휴식 또는 지구력 강도 |
| `steps` | 수행방법 문장 배열 |
| `cues` | 핵심 자세 포인트 배열 |
| `stop` | 중단·주의 기준 배열 |
| `progress` | 순서대로 표시할 발전 단계 배열 |
| `parent` | 원운동은 `null`, 대체운동은 원운동 `id` |
| `motion` | `Anatomy.jsx`의 동작 식별자 |
| `unilateral` | 한발/한쪽 운동 여부 (데이터 메타정보) |

예를 들어 `"dose": "3세트 × 3회/다리"`를 원하는 양으로 바꾸거나, `progress` 배열의 문장을 편집하세요. 분류 설명은 같은 파일의 `principles`, 상단 데이 이름은 `days`에서 관리합니다. 대체운동은 같은 배열에 넣고 `parent`를 원운동 id로 지정합니다. 자동으로 원운동 아래 대체운동 노트에 표시됩니다.

기존 동작을 공유하는 운동은 데이터를 복사하고 `motion`을 재사용합니다. 새로운 움직임 자체를 추가하려면 `Anatomy.jsx`에 관절 키프레임과 기구를 정의해야 합니다. 근육 강조는 `primary`와 `secondary`를 따릅니다. 근육 모양과 전후면 렌더링은 `MuscleFigure.jsx`, 부위별 소분류는 `data.js`의 `regionMuscles`에서 관리합니다.

## 탐색과 동작

- **데이별**: 작은 데이 버튼만 표시합니다. 다른 종류의 필터는 숨깁니다.
- **부위별**: 상단의 하체·상체·코어·전신을 선택하면 해당 부위 아래에 작은 세부 근육 버튼이 펼쳐집니다. 부위를 바꾸면 이전 세부 선택은 해제됩니다.
- **훈련능력별**: 데이 선택과 같은 상단 위치에서 파워 / 최대근력 / 가속 / 감속 / 지구력 안정성 중 선택합니다.
- 파워는 모든 파워 하위 분류, 가속은 최고속도, 감속은 편심근력·방향전환을 포함합니다. 지구력 안정성은 인터벌·장거리 지구력·코어 안정성·견갑·관절 안정성을 포함합니다.
- 모드를 바꾸면 이전 모드의 조건은 초기화됩니다. 숨겨진 필터가 결과에 영향을 주지 않습니다.
- 세부 근육은 주동근과 보조근을 모두 검색합니다. 운동 목록에는 이름만 표시합니다. 대체운동은 ↳ 기호·18px 들여쓰기·연한 색으로 표시합니다.
- 세부 훈련 분류와 설명은 운동 노트에 유지합니다. 간단한 탐색 분류의 매핑은 `src/data.js`의 `trainingGroups`에서 수정합니다.
- 인체 기본색은 파랑, 주동근은 빨강, 보조근은 주황입니다. 테두리·단계 구분·좌우 전환·배속 선택을 제거했습니다.
- 동작 조작은 일시정지/재생 버튼 하나입니다. 기기의 동작 줄이기 설정이 켜져 있으면 처음에는 정지합니다.
- 모바일 순서: 동작 → 운동 노트 → 운동 목록. ‘운동 선택’ 링크로 목록에 바로 이동합니다.

## GitHub Pages 배포

1. **이 `kinetic` 폴더 안의 파일들**을 GitHub 저장소 루트에 올립니다. `node_modules`는 올리지 않습니다.
2. 기본 브랜치를 `main`으로 사용합니다. 다른 이름이면 `.github/workflows/deploy.yml`의 branches를 바꿉니다.
3. 저장소 Settings → Pages → Source에서 **GitHub Actions**를 선택합니다.
4. `main`에 push하거나 Actions의 Deploy Kinetic 워크플로를 수동 실행합니다.
5. 배포가 끝나면 Pages 주소로 접속합니다.

`base: './'`이므로 저장소 하위 경로에서도 리소스가 로드됩니다. 별도 라우터가 없어 새로고침용 서버 설정도 필요하지 않습니다. 이 작업에서는 GitHub 저장소 생성이나 실제 외부 배포를 수행하지 않았습니다.

참고: [Vite 정적 배포 가이드](https://vite.dev/guide/static-deploy.html#github-pages)

## 운동 정보와 도식의 범위

요청한 프로그램을 그대로 구조화했으며, 누락된 수행방법·주의 포인트를 보완했습니다. 원문에 없던 휴식은 `(권장)`으로 구분했습니다. Depth Jump는 CMJ의 고급 선택지이며, 복싱은 스프린트와 동일한 자극의 운동으로 표시하지 않습니다. 대체운동은 동작·부하·속도 요구가 완전히 같지 않습니다.

SVG는 관절과 힘의 흐름을 이해하기 위한 2차원 도식입니다. 3D 모션캡처나 개인 자세 교정 도구는 아닙니다. 회전 동작은 사선에서의 간소화 표현입니다. 충분한 준비운동 후 수행하고, 파워는 출력 저하 시 종료합니다. 착지·단계적 발전의 참고 자료는 [NSCA](https://www.nsca.com/education/videos/plyometric-implementation-setup-and-execution-of-jump-landing-positions-to-decrease-likelihood-of-injuries/)입니다.

Google Fonts 연결이 가능하면 Noto Sans KR과 Barlow Condensed를 사용하며, 불가능하면 기기의 기본 글꼴로 표시합니다. 운동 데이터·그림에는 외부 사진이나 API가 필요하지 않습니다.



