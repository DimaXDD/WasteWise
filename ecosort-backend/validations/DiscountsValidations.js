const { body } = require('express-validator');

exports.addDiscounts  = [
    body('promo_code', 'Введите промокод').isLength({min: 5}),
    body('discount', 'Введите скидку').isLength({min: 5}),
    body('count_for_dnt', 'Вы ввели не число').isNumeric()
];

// exports.editDiscounts  = [
    // body('discount', 'Введите скидку').isLength({min: 3}),
    // body('count_for_dnt', 'Вы ввели не число').isNumeric()
// ];