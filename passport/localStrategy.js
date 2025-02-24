const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// 암호화된 비밀번호와 비교하기 위해 사용되는 라이브러리
const bcrypt = require('bcrypt');
const db = require(process.cwd() + '/models');

// 로그인 시 사용자의 ID 와 비밀번호를 검증한다
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password',
        passReqToCallback: false,
    }, async (id, password, done) => {
        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE id=?', [id]);
            if (rows.length > 0) {
                const result = await bcrypt.compare(password, rows[0].password);
                if (result) {
                    done(null, rows[0]);
                } else {
                    done(null, false, {message: '비밀번호가 틀렸습니다.'});
                }
            } else {
                done(null, false, {message: '회원 정보가 존재하지 않습니다.'});
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }))
};