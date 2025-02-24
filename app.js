// 주요 모듈과 설정
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8012);
app.set('view engine', 'html');

// Nunjucks 설정
nunjucks.configure('views', { express: app, watch: true });

// Middlewares
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 세션보다 위에
app.use(express.json()); // JSON 미들웨어
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Passport 설정
require('./passport')();
app.use(passport.initialize());
app.use(passport.session());

// 라우터 설정
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const studyApiRouter = require('./routes/study'); // studyApi 라우터 설정
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/api', studyApiRouter); // studyApi 라우터 설정

// Study 방문 기록
app.get('/study/:studyId', (req, res) => {
    const { studyId } = req.params;
    res.cookie('lastVisitedStudy', studyId, { httpOnly: true, secure: false });
    res.sendFile(path.join(__dirname, 'public', 'study.html'));
});
// 최근 방문한 Study
app.get('/lastVisited', (req, res) => {
    const lastVisitedStudy = req.cookies.lastVisitedStudy;
    if (lastVisitedStudy) {
        res.redirect(`/study/${lastVisitedStudy}`);
    } else {
        res.send('최근 방문한 스터디가 없습니다.');
    }
});

// 에러 핸들링
app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV !== 'production' ? err : {},
    });
});

// 서버 실행
app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중`);
});
