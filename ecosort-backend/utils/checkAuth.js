const jwt = require('jsonwebtoken')

module.exports = function chekAuth(req, res, next) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token){
        try{
            const decoded = jwt.verify(token, accessKey);
            req.userId = decoded.id;
            next();
        }
        catch(e){
            return res.status(403).json({
                message: 'Нет доступа(не авторизован)',
            });
        }
    }
    else{
        return res.status(403).json({
            message: 'Нет доступа(не авторизован)',
        });
    }
}


// export default (req, res, next) => {
//     const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
//     if (token){
//         try{
//             const decoded = jwt.verify(token, accessKey);
//             req.userId = decoded.id;
//             next();
//         }
//         catch(e){
//             return res.status(403).json({
//                 message: 'Нет доступа(не авторизован)',
//             });
//         }
//     }
//     else{
//         return res.status(403).json({
//             message: 'Нет доступа(не авторизован)',
//         });
//     }
// }