# 스터디 그룹 개설 및 관리 웹서비스
- 이 프로젝트는 Node.js 와 Express, REST API 를 활용한 서버입니다.
## 주요 기능
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
📁 study-hub
├── 📂 controllers
│   ├── page.js  # 메인 페이지 및 스터디 관련 컨트롤러
│   ├── study.js  # 스터디 관리 컨트롤러
│   ├── auth.js  # 인증 관련 컨트롤러
├── 📂 routes
│   ├── page.js  # 메인 페이지 라우팅
│   ├── study.js  # 스터디 관련 라우팅
│   ├── auth.js  # 인증 관련 라우팅
├── 📂 views
│   ├── index.html  # 메인 페이지
│   ├── profile.html  # 내 스터디 정보 페이지
│   ├── study.html  # 개별 스터디 페이지
├── 📂 public
│   ├── study.css  # 프론트엔드 스타일링
│   ├── study.js  # 프론트엔드 기능 구현
├── app.js  # 서버 실행 및 미들웨어 설정
├── passport  # Passport.js 설정 파일
├── package.json  # 프로젝트 종속성 관리
```

## 🚀실행 방법
1. 클론 및 의존성 설치
   ```
   git clone https://github.com/yeochaeeon/24Fall-WAP_termproject
   cd 24Fall-WAP_termproject
   npm install
   ```
2. 환경변수 설정
3. 서버 실행
  ``` npm start```
