const { body } = require('express-validator');

exports.addPoints  = [
    body('address', 'Введите адрес').isLength({min: 3}).isString(),
    body('time_of_work', 'Введите время работы ').isLength({min: 5}).isString(),
    body('link_to_map', 'Введите ссылку').isLength({min: 10}).isString(),
    body('point_name', 'Введите имя нупкта приема').isLength({min: 5}).isString(),
];

exports.editPoints  = [
    body('time_of_work', 'Введите время работы').isLength({min: 5}).isString(),
];

exports.editKey  = [
    body('secret_key', 'Ключ слишком короткий').isLength({min: 8}).isString(),
];


exports.addKey  = [
    body('secret_key', 'Ключ слишком короткий').isLength({min: 8}).isString(),
];