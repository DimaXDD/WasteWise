const express = require('express');
const RatingsController = require("../controllers/RatingsController");
const checkAuth = require('../utils/checkAuth');
const checkRole = require("../utils/checkRole");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Операции с рейтингами статей
 */

/**
 * @swagger
 * /ratings/{article_id}:
 *   get:
 *     summary: Получить рейтинг статьи по ID статьи
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID статьи
 *     responses:
 *       200:
 *         description: Рейтинг статьи успешно получен
 *       404:
 *         description: Статья не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.get('/ratings/:article_id', RatingsController.getRatings);

/**
 * @swagger
 * /ratings:
 *   get:
 *     summary: Получить все рейтинги
 *     tags: [Ratings]
 *     responses:
 *       200:
 *         description: Список всех рейтингов успешно получен
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.get('/ratings', RatingsController.getAllRating);

/**
 * @swagger
 * /ratings/{article_id}:
 *   post:
 *     summary: Добавить новый рейтинг для статьи по ID
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID статьи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Оценка для статьи
 *     responses:
 *       201:
 *         description: Рейтинг успешно добавлен
 *       400:
 *         description: Ошибка при отправке рейтинга
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.post('/ratings/:article_id', checkAuth, RatingsController.addRatings);

/**
 * @swagger
 * /ratings/{id}:
 *   delete:
 *     summary: Удалить рейтинг по ID
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID рейтинга
 *     responses:
 *       200:
 *         description: Рейтинг успешно удален
 *       404:
 *         description: Рейтинг не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.delete('/ratings/:id', checkAuth, RatingsController.deleteRatings);

module.exports = router;
