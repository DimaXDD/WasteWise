const { body } = require('express-validator');

exports.Receptions  = [
    body('weight', 'Вы ввели не верное число').isNumeric(),
    body('type_waste', 'Введите тип сдаваемых отходов').isLength({min: 3 }).isString(),
    // body('station_key', 'Ключ слишком маленький').isLength({min: 8 }).isString(),
];
