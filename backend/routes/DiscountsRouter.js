const express = require('express');
const DiscountsController = require("../controllers/DiscountsController");
const validator = require('../validations/DiscountsValidations');
const checkRole = require('../middleware/checkRole');
const ValidError = require('../middleware/HandleErrors');
const checkAuth = require("../middleware/checkAuth");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Операции со скидками
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Получить список скидок
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список скидок
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get   ('/discounts',          checkRole, DiscountsController.getDiscounts);

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Получить информацию о скидке по ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор скидки
 *         schema:
 *           type: string
 *           example: "1"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные о скидке
 *       404:
 *         description: Скидка не найдена
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get   ('/discounts/:id',      checkRole, DiscountsController.getDiscount);

/**
 * @swagger
 * /used/discounts:
 *   get:
 *     summary: Получить список использованных скидок для текущего пользователя
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список использованных скидок
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get   ('/used/discounts',     checkAuth, DiscountsController.showMyDiscounts);

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Добавить новую скидку
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "DISCOUNT2024"
 *                 description: Код скидки
 *               value:
 *                 type: number
 *                 format: float
 *                 example: 15.5
 *                 description: Значение скидки (процент)
 *               description:
 *                 type: string
 *                 example: "15% скидка на все товары"
 *                 description: Описание скидки
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Скидка успешно добавлена
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post  ('/discounts',          checkRole, validator.addDiscounts, ValidError, DiscountsController.addDiscounts);

/**
 * @swagger
 * /discounts/{id}:
 *   put:
 *     summary: Редактировать информацию о скидке
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор скидки
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "DISCOUNT2024"
 *               value:
 *                 type: number
 *                 format: float
 *                 example: 15.5
 *               description:
 *                 type: string
 *                 example: "15% скидка на все товары"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Скидка успешно обновлена
 *       400:
 *         description: Ошибка валидации данных
 *       404:
 *         description: Скидка не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put   ('/discounts/:id',      checkRole, DiscountsController.editDiscounts);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Удалить скидку по ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор скидки
 *         schema:
 *           type: string
 *           example: "1"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Скидка удалена
 *       404:
 *         description: Скидка не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.delete('/discounts/:id',      checkRole, DiscountsController.deleteDiscounts);

/**
 * @swagger
 * /used/discounts/{id}:
 *   put:
 *     summary: Использовать скидку для текущего пользователя
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Идентификатор скидки
 *         schema:
 *           type: string
 *           example: "1"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Скидка использована
 *       404:
 *         description: Скидка не найдена
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.put   ('/used/discounts/:id', checkAuth, DiscountsController.usedMyDiscounts);

/**
 * @swagger
 * /user/viewDiscounts:
 *   get:
 *     summary: Получить список доступных скидок для текущего пользователя
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список доступных скидок
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/user/viewDiscounts', checkAuth, DiscountsController.viewUserDiscounts);

/**
 * @swagger
 * /user/allDiscounts:
 *   get:
 *     summary: Получить все скидки с информацией о доступности для текущего пользователя
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех скидок с информацией о доступности
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.get('/user/allDiscounts', checkAuth, DiscountsController.getAllDiscountsWithAvailability);

module.exports = router;