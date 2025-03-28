const { body } = require('express-validator');

exports.addRatings  = [
    body('comment', 'Введите текст комментария').isLength({min: 3 }).isString(),
    body('comment', "Введите текст менее 500 символов").isLength({max:500}).isString()
];