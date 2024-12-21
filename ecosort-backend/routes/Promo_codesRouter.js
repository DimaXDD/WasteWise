const express = require('express');
const Promo_codesController = require("../controllers/Promo_codesController");
const checkAuth = require('../utils/checkAuth');

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promo Codes
 *   description: Операции с промокодами
 */

/**
 * @swagger
 * /promo:
 *   get:
 *     summary: Получить все промокоды
 *     tags: [Promo Codes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращены промокоды
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /promo/{id}:
 *   delete:
 *     summary: Удалить промокод по ID
 *     tags: [Promo Codes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID промокода для удаления
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Промокод успешно удален
 *       404:
 *         description: Промокод с таким ID не найден
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.get('/promo', checkAuth, Promo_codesController.getPromoCodes);
router.delete('/promo/:id', checkAuth, Promo_codesController.deletePromoCode);

module.exports = router;
