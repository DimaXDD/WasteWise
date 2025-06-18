const path = require('path')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const bcrypt = require('bcrypt')
const { chekAuth } = require('../middleware/checkAuth')
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const logger = require('../middleware/logger');

const SALT_ROUNDS = 10;

const AuthController = {
    RegisterUser: async (req, res) => {
        try {
          const isGoogleAuth = req.body.isGoogleAuth === true || req.body.isGoogleAuth === 'true';
      
          if (!isGoogleAuth && (!req.body.password || req.body.password.length < 9)) {
            return res.status(400).json({
              errors: [{
                msg : 'Слишком маленький пароль, минимум 9 символов',
                path: 'password',
                type: 'field'
              }]
            });
          }
      
          const i_password = req.body.password || uuid.v4();
          const o_password = await bcrypt.hash(i_password, SALT_ROUNDS);
      
          const [v_check_user, v_check_email] = await Promise.all([
            db.models.Users.findOne({ where: { username: req.body.username } }),
            db.models.Users.findOne({ where: { email: req.body.email } })
          ]);
      
          if (v_check_user) {
            return res.status(400).json({ message: 'Имя пользователя занято, введите другое' });
          }
      
          if (v_check_email) {
            // Проверяем способ регистрации существующего пользователя
            const existingUser = await db.models.Users.findOne({ where: { email: req.body.email } });
            if (existingUser.activation_link === null) {
              return res.status(400).json({ 
                message: 'Аккаунт с этой почтой уже существует и был зарегистрирован через Google. Пожалуйста, войдите через Google.',
                errorType: 'google_user_exists'
              });
            } else {
              return res.status(400).json({ 
                message: 'Аккаунт с этой почтой уже существует и был зарегистрирован через email. Пожалуйста, войдите через обычную форму или активируйте аккаунт.',
                errorType: 'email_user_exists'
              });
            }
          }
      
          const activation_link = isGoogleAuth ? null : uuid.v4();
      
          const candidate = await db.models.Users.create({
            username      : req.body.username,
            email         : req.body.email,
            password_hash : o_password,
            role          : 'user',
            is_activated  : isGoogleAuth,
            activation_link
          });
      
          if (!isGoogleAuth) {
            const transporter = nodemailer.createTransport({
              host  : process.env.SMTP_HOST,
              port  : 465,
              secure: true,
              auth  : {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
              }
            });
      
            const send_link = `${process.env.API_URL}/activate/${activation_link}`;
      
            await transporter.sendMail({
              from   : process.env.SMTP_USER,
              to     : candidate.email,
              subject: 'Подтверждение регистрации на WasteWise',
              html   : `
                <div style="font-family: Arial, sans-serif;">
                <h2 style="color:#4CAF50;">Здравствуйте, ${req.body.username}!</h2>
                <p>Благодарим за регистрацию на платформе <strong>WasteWise</strong> — месте, где мы вместе заботимся о нашем будущем через переработку отходов.</p>
                <p>Для завершения регистрации и активации вашего аккаунта, пожалуйста, перейдите по ссылке:</p>
                <a href="${send_link}"
                    style="display:inline-block;margin:10px 0;padding:10px 20px;color:#fff;background:#4CAF50;
                            text-decoration:none;border-radius:5px;">
                    Активировать аккаунт
                </a>
                <p>Или скопируйте ссылку в адресную строку браузера:</p>
                <p style="font-size:14px;color:#555;">${send_link}</p>
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="font-size:12px;color:#777;">
                    Если вы не регистрировались на WasteWise, просто проигнорируйте это письмо.
                </p>
                <p>С уважением,<br>Команда WasteWise</p>
                </div>
                    `
            });
          }
      
          res.json({
            success      : true,
            isGoogleAuth : isGoogleAuth,
            emailSent    : !isGoogleAuth,
            message      : isGoogleAuth ? 'Регистрация через Google прошла успешно' : 'Регистрация прошла успешно! Проверьте вашу почту для активации аккаунта.'
          });
      
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Не удалось зарегистрироваться', error: err.message });
        }
    },

    CreateAdmin: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const existingAdmin = await db.models.Users.findOne({
                where: { role: "admin" },
            });

            if (existingAdmin) {
                return res.status(400).json({
                message:
                    "Администратор уже существует. Создать больше одного администратора невозможно.",
            });
            }
    
            const salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const hashedPassword = await bcrypt.hash(password, salt);
    
            const existingUser = await db.models.Users.findOne({
                where: { [Op.or]: [{ username }, { email }] },
            });
    
            if (existingUser) {
                return res.status(400).json({
                    message: 'Имя пользователя или почта уже заняты',
                });
            }
    
            const newAdmin = await db.models.Users.create({
                username,
                email,
                password_hash: hashedPassword,
                role: 'admin',
                is_activated: true,
            });
    
            res.status(201).json({
                message: 'Администратор успешно создан',
                user: {
                    id: newAdmin.id,
                    username: newAdmin.username,
                    email: newAdmin.email,
                    role: newAdmin.role,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Не удалось создать администратора',
            });
        }
    },
    
    LoginUser: async (req, res) => {
        try {
            const isGoogleAuth = req.body.isGoogleAuth === true || req.body.isGoogleAuth === 'true';
            const i_user = await db.models.Users.findOne({
                where: {
                    [Op.and]: [{ email: req.body.email }, { is_activated: 1 }],
                }
            });
            logger.info(`User tried to login with email: ${req.body.email}`);
    
            if (i_user == null) {
                logger.warning('Login failed: Invalid email or account not activated');
                res.json({ message: 'Неверная почта или пароль' });
            } else {
                // Проверяем способ регистрации пользователя
                const isGoogleUser = i_user.activation_link === null;
                
                // Исключение для администраторов - они могут входить через обычную форму
                if (i_user.role === 'admin') {
                    // Администраторы могут входить через обычную форму независимо от способа регистрации
                    let isValidPass = true;
                    if (!isGoogleAuth) {
                        isValidPass = await bcrypt.compare(req.body.password, i_user.password_hash);
                    }
                    
                    if (!isValidPass) {
                        logger.warning('Login failed: Incorrect password for admin');
                        res.json({ message: 'Неверная почта или пароль' });
                    } else {
                        const accessToken = jwt.sign({ id: i_user.id, username: i_user.username, role: i_user.role }, accessKey, { expiresIn: 30 * 60 });
                        const refreshToken = jwt.sign({ id: i_user.id, username: i_user.username, role: i_user.role }, refreshKey, { expiresIn: 24 * 60 * 60 });
        
                        // Вывод токенов в консоль для отладки
                        console.log('Access Token:', accessToken);
                        console.log('Refresh Token:', refreshToken);
        
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                            sameSite: 'strict'
                        });
                        res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            sameSite: 'strict'
                        });
                        res.json({
                            message: 'Авторизация прошла успешно',
                            accessToken,
                            user: {
                                id: i_user.id,
                                username: i_user.username,
                                role: i_user.role,
                                points: i_user.points
                            }
                        });
                    }
                    return;
                }
                
                // Для обычных пользователей - проверяем соответствие способа входа и регистрации
                // Если пользователь пытается войти через Google, но регистрировался через обычную форму
                if (isGoogleAuth && !isGoogleUser) {
                    logger.warning('Login failed: User registered via email/password, trying to login via Google');
                    res.json({ 
                        message: 'Этот аккаунт был зарегистрирован через email и пароль. Пожалуйста, используйте обычную форму входа.',
                        errorType: 'wrong_auth_method'
                    });
                    return;
                }
                
                // Если пользователь пытается войти через обычную форму, но регистрировался через Google
                if (!isGoogleAuth && isGoogleUser) {
                    logger.warning('Login failed: User registered via Google, trying to login via email/password');
                    res.json({ 
                        message: 'Этот аккаунт был зарегистрирован через Google. Пожалуйста, используйте вход через Google.',
                        errorType: 'wrong_auth_method'
                    });
                    return;
                }
                
                let isValidPass = true;
                if (!isGoogleAuth) {
                    isValidPass = await bcrypt.compare(req.body.password, i_user.password_hash);
                }
                
                if (!isValidPass) {
                    logger.warning('Login failed: Incorrect password');
                    res.json({ message: 'Неверная почта или пароль' });
                } else {
                    const accessToken = jwt.sign({ id: i_user.id, username: i_user.username, role: i_user.role }, accessKey, { expiresIn: 30 * 60 });
                    const refreshToken = jwt.sign({ id: i_user.id, username: i_user.username, role: i_user.role }, refreshKey, { expiresIn: 24 * 60 * 60 });
    
                    // Вывод токенов в консоль для отладки
                    console.log('Access Token:', accessToken);
                    console.log('Refresh Token:', refreshToken);
    
                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    });
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    });
                    res.json({
                        message: 'Авторизация прошла успешно',
                        accessToken,
                        user: {
                            id: i_user.id,
                            username: i_user.username,
                            role: i_user.role,
                            points: i_user.points
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось авторизоваться'
            });
        }
    },

    Logout: (req, res) => {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.json({
            success: true,
        });
    },

    getMe: async (req, res) => {
        try {
            const user = await db.models.Users.findByPk(req.userId)
            if (!user) {
                return res.json({
                    message: 'Пользователь не найден',
                })
            }
            res.json({ user });
        }
        catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось найти пользователя'
            });
        }
    },

    activate: async (req, res) => {
        const v_find_user = await db.models.Users.findOne({
            where: { activation_link: req.params.link }
        })

        if (v_find_user == null) {
            res.json({
                message: 'Пользовватель не существует'
            });
        }
        else {
            await db.models.Users.update({
                is_activated: true,
            }, { where: { id: v_find_user.id } })
            return res.redirect('http://localhost:3000/login')

            res.json({
                message: 'Вы подтвердили свою почту'
            });
        }
    }
}
module.exports = AuthController