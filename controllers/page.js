const db = require(process.cwd() + '/models');
// 나의 스터디 개설, 가입 정보 제공
exports.renderProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 사용자가 개설한 스터디 목록 가져오기
        const [createdStudies] = await db.execute(
            `
                SELECT sg.id, sg.title, DATE_FORMAT(sg.createdAt, '%Y-%m-%d') AS createdAt
                FROM study_groups sg
                WHERE sg.createdBy = ?
                ORDER BY sg.createdAt DESC
            `,
            [userId]
        );

        // 사용자가 가입한 스터디 목록 가져오기
        const [joinedStudies] = await db.execute(
            `
                SELECT sg.id, sg.title, DATE_FORMAT(sm.joinDate, '%Y-%m-%d') AS joinDate, u.nick AS createdBy
                FROM study_members sm
                         JOIN study_groups sg ON sm.studyId = sg.id
                         JOIN users u ON sg.createdBy = u.id
                WHERE sm.userId = ? AND sg.createdBy != ?
                ORDER BY sm.joinDate DESC
            `,
            [userId, userId]
        );

        res.render('profile', {
            title: '내 정보 - Study Manager',
            user: req.user,
            createdStudies,
            joinedStudies,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - Study Manager' });
};

// 스터디 목록 열람
exports.renderMain = async (req, res, next) => {
    try {
        const userId = req.user ? req.user.id : null;

        const [studyGroups] = await db.execute(`
            SELECT
                sg.id,
                sg.title,
                sg.maxMembers,
                sg.createdBy,
                u.nick AS createdByNick,
                (SELECT COUNT(*) FROM study_members sm WHERE sm.studyId = sg.id) AS currentMembers,
                EXISTS (
                    SELECT 1
                    FROM study_members sm
                    WHERE sm.studyId = sg.id AND sm.userId = ?
                ) AS isMember,
                sg.createdBy = ? AS isOwner
            FROM study_groups sg
                     LEFT JOIN users u ON sg.createdBy = u.id
            ORDER BY sg.createdAt DESC
        `, [userId, userId]);

        const studylist = studyGroups.map((study) => ({
            id: study.id,
            title: study.title,
            createdBy: {
                id: study.createdBy,
                nick: study.createdByNick || "Unknown",
            },
            maxMember: study.maxMembers,
            currentMember: study.currentMembers,
            isOwner: !!study.isOwner,
            isMember: !!study.isMember,
        }));

        console.log("Study List with Membership Info:", studylist);

        res.render("main", {
            title: "Study Manager",
            user: req.user || null,
            studylist,
        });
    } catch (err) {
        console.error("Error in renderMain:", err);
        next(err);
    }
};
// 스터디 모임 개설
exports.registerStudy = async (req, res, next) => {
    const { title, maxMembers } = req.body;
    if (!title || !maxMembers) {
        return res.redirect('/?error=missing');
    }
    try {
        const [result] = await db.execute(
            `INSERT INTO study_groups (title, maxMembers, createdBy) VALUES (?, ?, ?)`,
            [title, maxMembers, req.user.id]
        );
        console.log(result);
        const studyId = result.insertId; // 생성된 스터디 ID 가져오기

        // 생성자를 study_members에 추가
        await db.execute(
            `INSERT INTO study_members (userId, studyId) VALUES (?, ?)`,
            [req.user.id, studyId]
        );
        res.cookie('lastVisitedStudy', studyId, { httpOnly: true, secure: false }); // 쿠키 설정
        res.redirect('/'); // 메인 페이지로 리다이렉트
    } catch (err) {
        console.error(err);
        next(err);
    }
};
// 스터디 모입 가입 처리
exports.joinStudy = async (req, res, next) => {
    const { studyId } = req.body;

    try {
        // 현재 가입 인원과 최대 인원을 확인
        const [[study]] = await db.execute(
            `
                SELECT
                    sg.title,
                    COUNT(sm.userId) AS currentMembers,
                    MAX(sg.maxMembers) AS maxMembers
                FROM study_groups sg
                         LEFT JOIN study_members sm ON sg.id = sm.studyId
                WHERE sg.id = ?
                GROUP BY sg.id
            `,
            [studyId]
        );
        if (study.currentMembers >= study.maxMembers) {
            return res.redirect('/?error=maxMembers'); // 최대 인원 초과
        }
        // 스터디 가입
        await db.execute(
            `INSERT INTO study_members (userId, studyId) VALUES (?, ?)`,
            [req.user.id, studyId]
        );
        res.cookie('lastVisitedStudy', studyId, { httpOnly: true, secure: false }); // 쿠키 설정
        res.redirect(`/?success=${encodeURIComponent(study.title)}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
};


