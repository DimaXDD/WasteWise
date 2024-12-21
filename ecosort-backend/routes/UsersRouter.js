const express = require('express');
const UsersController = require("../controllers/UsersController");
const checkRole = require('../utils/checkRole');
const checkAuth = require("../utils/checkAuth");
const validator = require("../validations/AuthValidations");
const ValidError = require("../utils/HandleErrors");

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Операции с пользователями
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно возвращены данные о пользователе
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Изменить имя пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: changeUsername
 *         description: Новый логин пользователя
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Новый логин пользователя
 *               example: new_username
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Имя пользователя успешно изменено
 *       400:
 *         description: Ошибка при валидации имени пользователя
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

/**
 * @swagger
 * /user/pass:
 *   put:
 *     summary: Изменить пароль пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       401:
 *         description: Неавторизованный доступ
 *       500:
 *         description: Внутренняя ошибка сервера
 */

router.get('/user', checkAuth, UsersController.getUser);
router.put('/user', validator.changeUsername, ValidError, UsersController.changeUsername);
router.put('/user/pass', UsersController.changePass);

module.exports = router;
