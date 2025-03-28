const express = require('express');
const ArticlesController = require("../controllers/ArticlesController");
const checkAuth = require('../middleware/checkAuth');
const checkRole = require("../middleware/checkRole");

const validator = require('../validations/ArticlesValidations');
const ValidError = require('../middleware/HandleErrors');

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Операции с статьями
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Получить список всех статей
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Список статей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       date_of_pub:
 *                         type: string
 *                         format: date
 *                       image_url:
 *                         type: string
 *                       likes:
 *                         type: integer
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           username:
 *                             type: string
 */
router.get('/articles', ArticlesController.getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Получить статью по ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID статьи
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Статья
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       404:
 *         description: Статья не найдена
 */
router.get('/articles/:id', ArticlesController.getArticle);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Добавить новую статью
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Статья успешно добавлена
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/articles', checkAuth, validator.addArticles, ValidError, ArticlesController.addArticles);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Обновить статью по ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID статьи
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Статья успешно обновлена
 *       404:
 *         description: Статья не найдена
 */
router.put('/articles/:id', checkAuth, ArticlesController.updateArticles);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Удалить статью по ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID статьи
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Статья успешно удалена
 *       404:
 *         description: Статья не найдена
 */
router.delete('/articles/:id', checkAuth, ArticlesController.deleteArticles);

/**
 * @swagger
 * /like/{id}:
 *   put:
 *     summary: Поставить лайк статье
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID статьи
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Лайк поставлен
 *       404:
 *         description: Статья не найдена
 */
router.put('/like/:id', checkAuth, ArticlesController.like);

module.exports = router;
