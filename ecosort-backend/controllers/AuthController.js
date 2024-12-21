const path = require('path')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const bcrypt = require('bcrypt')
const { chekAuth } = require('../utils/checkAuth')
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const uuid = require('uuid');
const nodemailer = require('nodemailer');


const AuthController = {

    RegisterUser: async (req, res) => {
        try {
            const i_password = req.body.password;
            const salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_password = await bcrypt.hash(i_password, salt);

            const v_check_user = await db.models.Users.findOne({
                where: { username: req.body.username }
            })

            const v_check_email = await db.models.Users.findOne({
                where: { email: req.body.email }
            })

            if (v_check_user == null) {
                if (v_check_email == null) {

                    const v_activation_link = uuid.v4();

                    const candidate = await db.models.Users.create({
                        username: req.body.username,
                        email: req.body.email,
                        password_hash: o_password,
                        role: 'user',
                        is_activated: false,
                        activation_link: v_activation_link
                    })

                    const send_mail = req.body.email;
                    const send_link = 'http://localhost:8082/activate/' + v_activation_link;

                    const transporter = nodemailer.createTransport({
                        host: "smtp.yandex.ru",
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'dimatruba2004@yandex.ru',
                            pass: 'akllfknlkhqfbhtl'
                        }
                    });

                    const mailOptions = {
                        from: 'dimatruba2004@yandex.ru',
                        to: send_mail,
                        subject: 'Активация аккаунта на сайте ЭкоБудущее',
                        html:
                            `
                            <div> 
                            <h1 >Для активации перейдите по ссылке</h1>
                            <a href="${send_link}">${send_link}</a>
                            </div>
                            `
                    }

                    let info = await transporter.sendMail(mailOptions)

                    // const accessToken = jwt.sign({ id: candidate.null, username: candidate.username, role: candidate.role }, accessKey, { expiresIn: 30 * 60 })
                    // const refreshToken = jwt.sign({ id: candidate.null, username: candidate.username, role: candidate.role }, refreshKey, { expiresIn: 24 * 60 * 60 })
                    //
                    //
                    // res.cookie('accessToken', accessToken, {
                    //     httpOnly: true,
                    //     sameSite: 'strict'
                    // })
                    // res.cookie('refreshToken', refreshToken, {
                    //     httpOnly: true,
                    //     sameSite: 'strict'
                    // })
                    res.json({
                        message: 'Мы выслали вам письмо на указанную почту для ее подтверждения',
                        // accessToken,
                        // user: {
                        //     id: candidate.null,
                        //     username: candidate.username,
                        //     role: candidate.role
                        // }
                    });
                }
                else {
                    res.json({
                        message: 'Почта занята, введите другую'
                    });
                }
            }
            else {
                res.json({
                    message: 'Имя пользователя занято, введите другое'
                });
            }
        }
        catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось зарегистрироваться'
            });
        }
    },

    LoginUser: async (req, res) => {
        try {

            const i_user = await db.models.Users.findOne({
                where: {
                    [Op.and]: [{ email: req.body.email }, { is_activated: 1 }],
                }
            })
            console.log(i_user)

            if (i_user == null) {
                res.json({ message: 'Неверная почта или пароль' })
            }
            else {
                const isValidPass = await bcrypt.compare(req.body.password, i_user.password_hash);
                if (!isValidPass) {
                    res.json({ message: 'Неверная почта или пароль' })
                }
                else {
                    const accessToken = jwt.sign({ id: i_user.id, username: i_user.username, role: i_user.role }, accessKey, { expiresIn: 30 * 60 })
                    const refreshToken = jwt.sign({ id: i_user.id, username: i_user.username, role: i_user.role }, refreshKey, { expiresIn: 24 * 60 * 60 })

                    res.cookie('accessToken', accessToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    })
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    })
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