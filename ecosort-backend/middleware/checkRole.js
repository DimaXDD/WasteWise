const jwt = require('jsonwebtoken')

module.exports = function checkRole(req, res, next) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
        return res.status(403).json({
            message: 'Нет доступа(роль)',
        });
    } else {
        try {
            const decoded = jwt.verify(token, accessKey);
            req.role = decoded.role;
            const v_role = decoded.role
            if(v_role === 'admin')
            {
                next();
            }
            else {
                return res.json({
                    message: 'Нет доступа(роль)'
                })
            }
        } catch (e) {
            return res.json({
                message: 'Нет доступа(роль)',
            });
        }
    }
}