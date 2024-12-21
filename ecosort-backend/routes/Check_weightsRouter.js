const express = require('express');
const Check_weightsController = require("../controllers/Check_weightsController");
const checkAuth = require('../utils/checkAuth');
const checkRole = require('../utils/checkRole');
const validator = require("../validations/MarksValidations");
const ValidError = require("../utils/HandleErrors");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Check_weights
 *   description: Операции с весами
 */

/**
 * @swagger
 * /weight:
 *   post:
 *     summary: Добавить ключ для проверки веса
 *     tags: [Check_weights]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key_of_weight:
 *                 type: string
 *                 description: Ключ для веса (string), который будет зашифрован для хранения.
 *                 example: 'unique-weight-key-1234'
 *               rubbish_w:
 *                 type: string
 *                 description: Вид вторсырья для проверки.
 *                 example: 'Пластик'
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Вес для добавления.
 *                 example: 150.5
 *     responses:
 *       201:
 *         description: Ключ добавлен успешно
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Вид вторсырья не найден
 *       409:
 *         description: Комбинация вторсырья и веса уже существует
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.post('/weight', checkRole, checkAuth, validator.AddWeight, ValidError, Check_weightsController.addWeight);

module.exports = router;
