const express = require('express');
const ReceptionsController = require("../controllers/ReceptionsController");
const checkAuth = require('../utils/checkAuth');

// const ValidError = require('../utils/HandleErrors');
// const validator = require('../validations/ReceptionsValidations');

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Receptions
 *   description: Операции с приемами
 */

/**
 * @swagger
 * /receptions:
 *   post:
 *     summary: Добавить новый прием
 *     tags: [Receptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Прием успешно добавлен
 *       400:
 *         description: Ошибка при обработке данных
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.post('/receptions', checkAuth, ReceptionsController.Receptions);

// router.post('/Receptions', validator.Receptions, ValidError, chekAuth, ReceptionsController.Receptions);
// router.get('/Receptions', chekAuth, ReceptionsController.getReceptions);

module.exports = router;
