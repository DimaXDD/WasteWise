const express = require('express');
const AuthController = require('../controllers/AuthController');
const validator = require('../validations/AuthValidations');
const checkAuth = require('../middleware/checkAuth');
const ValidError = require('../middleware/HandleErrors');

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
 *               username:
 *                 type: string
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Мы выслали вам письмо на указанную почту для ее подтверждения"
 *       400:
 *         description: Ошибка валидации данных
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Почта занята, введите другую"
 *       409:
 *         description: Пользователь с таким именем уже существует
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Имя пользователя занято, введите другое"
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Не удалось зарегистрироваться"
 */
router.post('/register', validator.RegisterUser, ValidError, AuthController.RegisterUser);

/**
 * @swagger
 * /register/admin:
 *   post:
 *     summary: Создание нового администратора
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "adminuser"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: Администратор успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Администратор успешно создан"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "adminuser"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       400:
 *         description: Ошибка валидации данных или конфликт
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post('/register/admin', AuthController.CreateAdmin);

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