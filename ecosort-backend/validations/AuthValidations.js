const { body } = require('express-validator');

exports.RegisterUser  = [
    body('email', 'Неверный формат почты').isEmail().normalizeEmail(),
    body('email', 'Почта слишком длинная').isLength({max: 50}),
    body('password', 'Слишком маленький пароль, минимум 9 символов').isLength({min: 9 }),
    body('username', 'Укажите имя пользователя').isLength({min: 5}),
];

exports.LoginUser  = [
    body('email', 'Неверный формат почты').isEmail().normalizeEmail(),
    body('email', 'Укажите почту').isLength({min: 3}),
];

exports.changeUsername  = [
    body('newun', 'Слишком короткое имя пользователя, минимум 5 символов').isLength({min: 5}),
];