const express = require('express');
const PointsController = require("../controllers/PointsController");
const checkRole = require('../middleware/checkRole');
const checkAuth = require('../middleware/checkAuth');
const validator = require("../validations/PointsValidations");
const ValidError = require("../middleware/HandleErrors");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: Операции с баллами
 */

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Получить все баллы
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращены все баллы
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/points', checkAuth, PointsController.getPoints);

/**
 * @swagger
 * /points/{id}:
 *   get:
 *     summary: Получить баллы по ID
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID точки
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращена информация о баллах
 *       404:
 *         description: Баллы с таким ID не найдены
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/points/:id', checkRole, PointsController.getPoint);

/**
 * @swagger
 * /points/marks/{marks_id}:
 *   get:
 *     summary: Получить баллы по ID марок
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: marks_id
 *         required: true
 *         description: ID марок
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращены баллы
 *       404:
 *         description: Баллы для указанного marks_id не найдены
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/points/marks/:marks_id', checkAuth, PointsController.getPointByMarks);

/**
 * @swagger
 * /points:
 *   post:
 *     summary: Добавить баллы
 *     tags: [Points]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Баллы за задание"
 *               description:
 *                 type: string
 *                 example: "Описание баллов"
 *               value:
 *                 type: integer
 *                 example: 10
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Баллы успешно добавлены
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/points', validator.addPoints, ValidError, checkRole, checkAuth, PointsController.addPoints);

/**
 * @swagger
 * /points/key/{id}:
 *   put:
 *     summary: Обновить ключ для точки
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID точки для обновления ключа
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 example: "новый ключ"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ключ успешно обновлен
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Неавторизованный доступ
 *       404:
 *         description: Точка с таким ID не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/points/key/:id', validator.editKey, ValidError, checkRole, checkAuth, PointsController.editPointsKey);

/**
 * @swagger
 * /points/{id}:
 *   put:
 *     summary: Обновить информацию о точке
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID точки
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
 *               value:
 *                 type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о точке успешно обновлена
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Точка с таким ID не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put('/points/:id', validator.editPoints, ValidError, checkRole, checkAuth, PointsController.editPoints);

/**
 * @swagger
 * /points/{id}:
 *   delete:
 *     summary: Удалить точку по ID
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID точки для удаления
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Точка успешно удалена
 *       404:
 *         description: Точка с таким ID не найдена
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/points/:id', checkRole, PointsController.deletePoints);


module.exports = router;
