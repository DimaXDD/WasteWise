const db = require('../config/db')
const bcrypt = require("bcrypt");
const {Op} = require("sequelize");

const UsersController = {
    getUser: async (req, res) => {
        try {
            const users = await db.models.Users.findOne({
                attributes: ['id', 'username', 'email', 'points', 'role', 'is_activated', 'activation_link'],
                where: { id: req.userId }
            })

            if (!users) {
                return res.json({ message: 'Пользователей нет' })
            }
            else {
                res.json({ users })
            }
        }
        catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти пользователей',
            });
        }
    },
    changeUsername: async (req, res) => {
        try {
            const i_n_username = req.body.newun;

            const v_user = await db.models.Users.findOne({
                attributes: ['username', 'password_hash'],
                where: {username: req.body.username}
            })

            console.log(v_user)

            const isValidPass = await bcrypt.compare(req.body.password, v_user.password_hash);

            console.log(isValidPass)

            if (isValidPass!=true) {
                res.json({ message: 'Неверное имя пользователя или пароль' })
            }

            else {
                const v_new_username = await db.models.Users.findOne({
                    attributes: ['username'],
                    where: {username: i_n_username}
                })
                console.log(v_new_username)

                if(v_new_username==null) {
                    const o_new_username = await db.models.Users.update({
                        username: i_n_username},
                        {where: {username: req.body.username}
                    })
        //
        //             console.log(o_new_username)
        //
                    res.json({
                        message: 'Имя пользователя изменено'
                    });
                }
                else {
                    res.json({
                        message: 'Имя пользователя занято, введите другое',
                    });
                }
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось изменить имя пользователя',
            });
        }
    },

    changePass: async (req, res) => {
        try{

            const i_password = req.body.password;
            const salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_password = await bcrypt.hash(i_password, salt);


            const v_user = await db.models.Users.findOne({
                attributes: ['email', 'password_hash'],
                where: {
                    [Op.and]: [{ email: req.body.email }, { password_hash: o_password }],
                }
            })

            if(v_user==null){
                res.json({
                    message: 'Не удалось изменить пароль',
                });
            }
            else{
            const i_new_pass = req.body.new_pass;
            const o_new_pass = await bcrypt.hash(i_new_pass, salt);

                const new_pass = await db.models.Users.update({
                        password_hash: o_new_pass},
                    { where: {
                            [Op.and]: [{ email: req.body.email }, { password_hash: o_password }],
                        }
                    })

            res.json({
                message: 'Пароль изменен'
            });
            }

        }catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось изменить пароль',
            });
        }

    },
}

module.exports = UsersController