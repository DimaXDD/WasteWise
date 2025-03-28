const { validationResult } = require('express-validator');

module.exports = function ValidError(req, res, next){
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            return res.json(errors.array())
        }
    next();
}