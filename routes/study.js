const express = require('express');
const { isLoggedIn } = require('../middlewares');
const studyController = require('../controllers/study');
const router = express.Router();
const path = require('path');
// 스터디 정보 가져오기
router.get('/study/:studyId', isLoggedIn, studyController.getStudy);

// 과제 목록 가져오기
router.get('/study/:studyId/tasks', isLoggedIn, studyController.getTasks);

// 공지 목록 가져오기
router.get('/study/:studyId/notices', isLoggedIn, studyController.getNotices);

// 과제 등록
router.post('/study/:studyId/tasks', isLoggedIn, studyController.createTask);

// 공지 등록
router.post('/study/:studyId/notices', isLoggedIn, studyController.createNotice);

module.exports = router;