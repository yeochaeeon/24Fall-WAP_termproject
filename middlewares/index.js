exports.isLoggedIn = (req, res, next) => {
    console.log(req.isAuthenticated());
    console.log('req user:', req.user);
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
        console.log('로그인하삼');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};
