const express = require('express');
const AuthController = require('../controllers/AuthController');
const validator = require('../validations/AuthValidations');
const checkAuth = require('../utils/checkAuth');
const ValidError = require('../utils/HandleErrors');

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Операции с авторизацией и пользователями
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации данных
 */
router.post('/register', validator.RegisterUser, ValidError, AuthController.RegisterUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Логин пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешный логин с возвращением токенов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOi..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOi..."
 *       401:
 *         description: Неверный логин или пароль
 */
router.post('/login', validator.LoginUser, ValidError, AuthController.LoginUser);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Лог-аут пользователя
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Пользователь успешно вышел из системы
 */
router.get('/logout', AuthController.Logout);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *       401:
 *         description: Необходима авторизация
 */
router.get('/me', checkAuth, AuthController.getMe);

/**
 * @swagger
 * /activate/{link}:
 *   get:
 *     summary: Активировать учетную запись через ссылку
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         description: Ссылка для активации
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Учетная запись успешно активирована
 *       400:
 *         description: Неверная ссылка активации
 */
router.get('/activate/:link', AuthController.activate);

module.exports = router;