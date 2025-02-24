const passport = require('passport');
const local = require('./localStrategy');
const db = require(process.cwd() + '/models');

module.exports = () => {
    // 로그인 성공시 유저 정보를 session에 저장
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 저장할 사용자 식별자
    });
    // 로그인 성공시 사용자의 스터디 개설수와 가입 수 정보를 보낸다.
    passport.deserializeUser(async (id, done) => {
        try {
            // 사용자 정보 가져오기
            const [rows] = await db.execute('SELECT id, nick FROM users WHERE id = ?', [id]);
            if (rows.length > 0) {
                const user = rows[0];

                // 사용자가 개설한 스터디 수
                const [createdStudies] = await db.execute(
                    'SELECT COUNT(*) AS createdCount FROM study_groups WHERE createdBy = ?',
                    [user.id]
                );

                // 사용자가 가입한 스터디 수
                const [joinedStudies] = await db.execute(
                    `
                    SELECT COUNT(*) AS joinedCount
                    FROM study_members sm
                    JOIN study_groups sg ON sm.studyId = sg.id
                    WHERE sm.userId = ? AND sg.createdBy != ?
                    `,
                    [user.id, user.id]
                );

                user.createdCount = createdStudies[0].createdCount || 0;
                user.joinedCount = joinedStudies[0].joinedCount || 0;

                done(null, user); // 사용자 객체 반환
            } else {
                done(null, false, { message: '사용자를 찾을 수 없습니다.' });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    });

    local();
};
