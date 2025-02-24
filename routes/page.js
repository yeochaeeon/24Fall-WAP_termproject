const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderProfile, renderJoin, renderMain, registerStudy,joinStudy } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
    console.log("req.user:", JSON.stringify(req.user, null, 2)); // req.user를 JSON으로 출력
    res.locals.user = req.user; // 템플릿에서 사용할 수 있도록 설정
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.get('/join', isNotLoggedIn, renderJoin);
// 메인페이지 - 스터디 목록 열람
router.get('/',renderMain);
// 스터디 개설
router.post('/register',registerStudy)
router.post('/study/join', joinStudy);


module.exports = router;