const { body } = require('express-validator');

exports.addArticles  = [
    body('title', 'Введите заголовок статьи').isLength({min: 5 }).isString(),
    body('text', 'Введите текст статьи').isLength({min: 9 }).isString(),
    body('text', 'Текст статьи слишком длинный').isLength({max:20000}).isString(),
    // body('image_url', 'Неверная ссылка на изображение').isString(),
];

exports.updateArticles  = [
    body('title', 'Введите текст статьи').isLength({min: 5 }).isString(),
    body('text', 'Введите текст статьи').isLength({min: 9 }).isString(),
    // body('image_url', 'Неверная ссылка на изображение').isString(),
];