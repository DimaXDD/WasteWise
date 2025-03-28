const express = require('express');
const Check_weightsController = require("../controllers/Check_weightsController");
const checkAuth = require('../middleware/checkAuth');
const checkRole = require('../middleware/checkRole');
const validator = require("../validations/MarksValidations");
const ValidError = require("../middleware/HandleErrors");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Check_weights
 *   description: Операции с весами
 */


/**
 * @swagger
 * /getWeight:
 *   get:
 *     summary: Получить данные о весах
 *     tags: [Check_weights]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные о весах успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор записи
 *                     example: 1
 *                   rubbish_id:
 *                     type: integer
 *                     description: Идентификатор вида вторсырья
 *                     example: 2
 *                   weight:
 *                     type: number
 *                     format: float
 *                     description: Вес
 *                     example: 150.5
 *                   key_of_weight:
 *                     type: string
 *                     description: Ключ для веса
 *                     example: 'unique-weight-key-1234'
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/getWeight', Check_weightsController.getWeight);

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

/**
 * @swagger
 * /editWeight:
 *   put:
 *     summary: Редактировать запись в проверке веса
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
 *               id:
 *                 type: integer
 *                 description: Идентификатор записи для редактирования
 *                 example: 1
 *               rubbish_w:
 *                 type: string
 *                 description: Новый вид вторсырья для проверки.
 *                 example: 'Пластик'
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Новый вес для добавления.
 *                 example: 150.5
 *               key_of_weight:
 *                 type: string
 *                 description: Новый ключ для веса (string), который будет зашифрован для хранения.
 *                 example: 'unique-weight-key-1234'
 *     responses:
 *       200:
 *         description: Запись успешно обновлена
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Вид вторсырья не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/editWeight', checkRole, checkAuth, validator.EditWeight, ValidError, Check_weightsController.editWeight);

module.exports = router;