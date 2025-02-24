const db = require(process.cwd() + '/models');

// 스터디 정보 가져오기 (GET /study/:studyId)
exports.getStudy = async (req, res, next) => {
    const { studyId } = req.params;
    try {
        const [[study]] = await db.execute(`
            SELECT sg.id, sg.title, sg.createdBy, u.nick AS creatorNick
            FROM study_groups sg
                     JOIN users u ON sg.createdBy = u.id
            WHERE sg.id = ?
        `, [studyId]);

        if (!study) {
            return res.status(404).json({ error: '스터디를 찾을 수 없습니다.' });
        }

        res.json({ study });
    } catch (err) {
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    const { studyId } = req.params;
    try {
        const [tasks] = await db.execute(`
            SELECT id, title, description, DATE_FORMAT(dueDate, '%Y-%m-%d') AS dueDate
            FROM tasks WHERE studyId = ? ORDER BY createdAt DESC
        `, [studyId]);

        res.json({ tasks });
    } catch (err) {
        next(err);
    }
};

exports.getNotices = async (req, res, next) => {
    const { studyId } = req.params;
    try {
        const [notices] = await db.execute(`
            SELECT id, title, content, DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt
            FROM notices WHERE studyId = ? ORDER BY createdAt DESC
        `, [studyId]);

        res.json({ notices });
    } catch (err) {
        next(err);
    }
};
exports.createTask = async (req, res, next) => {
    const { studyId } = req.params;
    const { title, description, dueDate } = req.body;

    try {
        await db.execute(`
            INSERT INTO tasks (studyId, title, description, dueDate)
            VALUES (?, ?, ?, ?)
        `, [studyId, title, description, dueDate]);

        res.status(201).json({ message: '과제가 성공적으로 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.createNotice = async (req, res, next) => {
    const { studyId } = req.params;
    const { title, content } = req.body;

    try {
        await db.execute(`
            INSERT INTO notices (studyId, title, content, createdBy)
            VALUES (?, ?, ?, ?)
        `, [studyId, title, content, req.user.id]);

        res.status(201).json({ message: '공지가 성공적으로 등록되었습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

