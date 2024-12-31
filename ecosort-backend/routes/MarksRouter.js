const express = require('express');
const MarksController = require("../controllers/MarksController");
const validator = require('../validations/MarksValidations');
const checkRole = require('../middleware/checkRole');
const checkAuth = require('../middleware/checkAuth');
const ValidError = require('../middleware/HandleErrors');

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Marks
 *   description: Операции с марками
 */

/**
 * @swagger
 * /marks:
 *   get:
 *     summary: Получить список всех марок
 *     tags: [Marks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращены все марки
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/marks', checkAuth, MarksController.getMarks);

/**
 * @swagger
 * /marks/{id}:
 *   get:
 *     summary: Получить информацию о марке по ID
 *     tags: [Marks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID марки
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращена информация о марке
 *       404:
 *         description: Марка не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/marks/:id', checkAuth, MarksController.getMark);

/**
 * @swagger
 * /marks:
 *   post:
 *     summary: Добавить новую марку
 *     tags: [Marks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Марка 1"
 *               description:
 *                 type: string
 *                 example: "Описание новой марки"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Марка успешно добавлена
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/marks', checkRole, validator.addMarks, ValidError, MarksController.addMarks);

/**
 * @swagger
 * /marks/{id}:
 *   put:
 *     summary: Обновить информацию о марке по ID
 *     tags: [Marks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID марки
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Марка успешно обновлена
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Марка не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/marks/:id', checkRole, validator.editMarks, ValidError, MarksController.editMarks);

/**
 * @swagger
 * /marks/{id}:
 *   delete:
 *     summary: Удалить марку по ID
 *     tags: [Marks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID марки для удаления
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Марка успешно удалена
 *       404:
 *         description: Марка не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/marks/:id', checkRole, MarksController.deleteMarks);


module.exports = router;
