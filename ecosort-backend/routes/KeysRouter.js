const express = require('express');
const KeysController = require("../controllers/KeysController");
const checkRole = require('../middleware/checkRole');
const validator = require("../validations/PointsValidations");
const ValidError = require("../middleware/HandleErrors");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Keys
 *   description: Операции с ключами
 */

/**
 * @swagger
 * /keys:
 *   post:
 *     summary: Добавить новый ключ
 *     tags: [Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key_name:
 *                 type: string
 *                 example: "KEY-1234"
 *                 description: Название или код ключа
 *               description:
 *                 type: string
 *                 example: "Описание нового ключа"
 *                 description: Описание ключа
 *               points:
 *                 type: integer
 *                 example: 100
 *                 description: Количество очков, связанных с ключом
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Ключ успешно добавлен
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/keys', checkRole, validator.addKey, ValidError, KeysController.addKeys);

module.exports = router;
