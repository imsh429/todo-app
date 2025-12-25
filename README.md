# TaskSync Web App (Vue.js)

Vue 3 + Vite + Firebase를 사용한 할일 관리 웹 애플리케이션

---

## ✨ 주요 기능

* **🔐 사용자 인증 (Auth):** Google 계정을 이용한 안전한 로그인 및 로그아웃 기능을 지원합니다.
* **📝 일정 관리 (CRUD):** 할 일(Todo)을 추가, 수정, 삭제하고 완료 상태를 토글할 수 있습니다.
* **📅 캘린더 뷰 (Calendar):** 월별 캘린더 UI를 통해 날짜별 일정을 한눈에 확인하고 관리합니다.
* **☁️ 실시간 동기화 (Sync):** Firebase Cloud Firestore를 연동하여 모든 데이터가 실시간으로 서버에 저장되고 동기화됩니다.
* **🎨 직관적인 UI:** 사용자 편의성을 고려한 깔끔한 디자인과 다이얼로그(Dialog) 인터페이스를 제공합니다.

---

## 🚀 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일에 Firebase 설정을 입력하세요:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

---

## 배포
JCLOUD를 통해 배포되었습니다.

배포 주소 : http://113.198.66.75:18109/

※ Firebase Authentication 승인된 도메인에 배포 주소가 등록되어 있습니다.

---

## 📁 프로젝트 구조

```
web-app/
├── src/
│   ├── assets/          # 전역 CSS
│   │   └── main.css
│   ├── components/          # Todo UI 컴포넌트
│   │   ├── AddTodoDialog.vue
│   │   ├── EditTodoDialog.vue
│   │   └── TodoItem.vue
│   ├── views/           # 페이지 컴포넌트
│   │   ├── LoginView.vue
│   │   ├── HomeView.vue
│   │   └── CalendarView.vue
│   ├── stores/          # Pinia 상태 관리
│   │   ├── auth.js      # Firebase 인증 상태 관리
│   │   └── todos.js     # Todo 상태 관리
│   ├── router/          # 인증 가드 포함 라우터
│   │   └── index.js
│   ├── firebase/        # Firebase 초기화 및 설정
│   │   └── config.js
│   ├── App.vue          # 루트 컴포넌트
│   └── main.js          # 앱 진입점
├── .env.local           # Firebase 환경변수 (Git 제외)
├── index.html
├── package.json
└── vite.config.js
```

---

## Firebase 연동 구조

- **Firebase 초기화** - src/firebase.config.js
- **Auth 사용** - src/stores/auth.js, src/router/index.js
- **DB 사용** - src/stores/todos.js
- **설정 파일** - .env.local

---

## 🛠️ 기술 스택

- **Vue 3** - 프론트엔드 프레임워크
- **Vite** - 빌드 도구
- **Vue Router** - 라우팅
- **Pinia** - 상태 관리
- **Firebase** - 인증 & 데이터베이스
- **PrimeVue** - UI 컴포넌트 라이브러리
- **FullCalendar** - 캘린더

---

