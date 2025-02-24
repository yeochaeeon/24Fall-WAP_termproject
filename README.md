# 📝STUDY-MANAGER
- 이 프로젝트는 스터디 개설 및 관리 서비스를 제공하는 Node.js 와 Express, REST API 를 활용한 서버입니다.
## 🔧주요 기능
1. 사용자 인증 (로그인 / 회원 가입)
   - passport, bcrypt 모듈 활용하여 인증 및 보안
2. 메인페이지 - 개설된 스터디 목록 열람
3. 스터디 그룹 개설 및 가입
   -  스터디 이름 및 최대 수용 인원을 입력하여 개설 가능
   -  개설 시 자동으로 스터디 개설자가 스터디원으로 등록됨
   -  개설된 스터디에 '가입하기' 버튼을 눌러 가입 가능
   -  최대 수용 인원을 초과한 경우 가입 제한
   -  rendering 활용 
4. 스터디 관리
   - 스터디 페이지에서 공지 및 과제 등록, 열람 가능
   - REST API 활용

## 🛠️ 기술 스택
- Backend: Node.js, Express
- Database: MySQL
- Frontend: HTML, CSS, JavaScript (Vanilla JS)
- Authentication: Passport.js, bcrypt
- Others: Cookie-parser, Express-static

## 📂 프로젝트 구조
```
📁 study-manager
    ├── 📁 config/
    │   └── config.json           # 애플리케이션 설정 파일
    ├── 📂 controllers
    │   ├── page.js               # 메인 페이지 및 스터디 관련 컨트롤러
    │   ├── study.js              # 스터디 관리 컨트롤러
    │   └── auth.js               # 인증 관련 컨트롤러
    ├── 📁 middlewares/
    │   └── index.js              # 미들웨어 로직
    ├── 📁 models/
    │   └── index.js              # MySQL 데이터베이스 풀 설정
    ├── 📁 passport/
    │   ├── index.js              # Passport 설정
    │   └── localStrategy.js      # 로컬 인증 전략
    ├── 📂 routes
    │   ├── page.js               # 메인 페이지 라우팅
    │   ├── study.js              # 스터디 관리 페이지 내부 라우팅
    │   └── auth.js               # 인증 관련 라우팅
    ├── 📂 views
    │   ├── error.html            # 오류 페이지 템플릿
    │   ├── join.html             # 회원가입 페이지 템플릿
    │   ├── layout.html           # 레이아웃 템플릿
    │   ├── main.html             # 메인 페이지 템플릿
    │   └── profile.html          # 프로필 페이지 템플릿
    ├── 📂 public
    │   ├── main.css              # 메인 스타일시트
    │   ├── study.css             # 스터디관리 페이지 스타일시트
    │   └── study.html            # 정적 HTML 파일
    ├── .env                       # 환경 변수 설정
    ├── app.js                     # 메인 애플리케이션 파일
    ├── package.json               # 프로젝트 종속성
    └── package-lock.json          # 종속성 잠금 파일
```

## 🚀실행 방법
1. 클론 및 의존성 설치
   ```
   git clone https://github.com/yeochaeeon/24Fall-WAP_termproject.git
   cd 24Fall-WAP_termproject
   npm install
   ```
2. 환경변수 설정
   - `.env`파일 생성 후 설
3. 서버 실행
   ```
   npm start
   ```
