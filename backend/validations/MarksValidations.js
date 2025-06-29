const { body } = require('express-validator');

exports.addMarks  = [
    body('rubbish', 'Введите вид вторсырья').isLength({min: 3}),
    body('points_per_kg', 'Вы ввели не число').isNumeric(),
    body('new_from_kg', 'Вы ввели не число').isNumeric(),

];

exports.editMarks  = [
    body('points_per_kg', 'Вы ввели не число').isNumeric(),
    body('new_from_kg', 'Вы ввели не число').isNumeric(),
];

exports.AddWeight  = [
    body('weight', 'Вы ввели не число').isNumeric(),
    body('rubbish_w', 'Введите вид вторсырья').isLength({min: 3}),
];

exports.EditWeight = [
    body('id', 'Некорректный идентификатор').isInt().toInt(),
    body('rubbish_w', 'Введите вид вторсырья').isLength({ min: 3 }),
    body('weight', 'Вы ввели не число').isNumeric(),
    body('key_of_weight', 'Введите ключ веса').isString().isLength({ min: 3 })
];
