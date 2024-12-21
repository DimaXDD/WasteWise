const db = require('../config/db')
const bcrypt = require('bcrypt')

const PointsController = {

    getPoints: async (req, res) => {
        try {
            const points = await db.models.Points.findAll({
                attributes: ["id", "address", "time_of_work", "key_id", "admin_id", "link_to_map", "point_name"],
            })

            if (!points) {
                return res.json({ message: "Пунктов нет" })
            }
            else {
                res.json({ points })
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти пункт сдачи',
            });
        }
    },

    getPoint: async (req, res) => {
        try {
            const points = await db.models.Points.findOne({
                attributes: ["id", "time_of_work"],
                where: { id: req.params.id }
            }
            )
            if (points == null) {
                res.json({
                    message: 'Не удалось найти точку сбора',
                });
            }
            else {
                res.set("Content-Type", "application/json")
                res.send(JSON.stringify(points))
                console.log(JSON.stringify(points))
            }

        }
        catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти точку сбора',
            });
        }
    },

    getPointByMarks: async (req, res) => {
        try {
            const i_mark_id = req.params.marks_id;
            console.log(i_mark_id)

            const points_marks = await db.models.Points_marks.findAll({
                attributes: ["id", "marks_id", "points_id"],
                include: [{
                    model: db.models.Points,
                    required: true,
                    attributes: ["id", "address", "time_of_work", "key_id", "admin_id", "link_to_map", "point_name"]
                }],
                where: { marks_id: i_mark_id }
            })

            // const v_marks = await db.models.Points_marks.findOne({
            //     attributes: ["id", "marks_id"],
            //     include: [{
            //         model: db.models.Marks,
            //         required: true,
            //         attributes: ["id", "rubbish"]
            //     }],
            //     where: { marks_id: i_mark_id }
            // })

            if (!points_marks
                // || !v_marks
            ) {
                return res.json({ message: 'Пунктов нет' })
            }
            else {
                res.json({
                    points_marks
                    // , v_marks
                })
            }
            console.log('Points' + points_marks)
            // console.log('Marks' + v_marks)
        }
        catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти точку сбора',
            });
        }
    },

    addPoints: async (req, res) => {
        try {
            function splitString(stringToSplit, separator) {
                return stringToSplit.split(separator);
            }

            const comma = ',';
            const i_rubbish = req.body.rubbish;
            const arrayOfStrings = splitString(i_rubbish, comma);
            const o_length = arrayOfStrings.length;
            const v_check_address = await db.models.Points.findOne({
                where: { address: req.body.address }
            })

            const v_check_point_name = await db.models.Points.findOne({
                where: { point_name: req.body.point_name }
            })

            if (v_check_address == null) {
                if (v_check_point_name == null) {
                    const v_find_used = await db.models.Keys.findOne({
                        where: { is_used: 0 }
                    })

                    if (v_find_used != null) {
                        const c_point = await db.models.Points.create({
                            address: req.body.address,
                            time_of_work: req.body.time_of_work,
                            key_id: v_find_used.id,
                            admin_id: req.userId,
                            link_to_map: req.body.link_to_map,
                            point_name: req.body.point_name,
                        })

                        await db.models.Keys.update({
                            is_used: 1,
                        }, {
                            where: { id: v_find_used.id }
                        })

                        const v_point_id = c_point.null
                        console.log(v_point_id)

                        for (let j = 0; j < o_length; j++) {
                            const i_rubbish = await db.models.Marks.findOne({
                                where: { rubbish: arrayOfStrings[j] }
                            })
                            if (i_rubbish==null){
                                res.json({
                                    message: `Такого ${arrayOfStrings[j]} вида вторсырья нет сначала добавить его во вторсырье`
                                });
                                return;
                            }
                            else {
                                const o_rubbish_id = i_rubbish.id
                                console.log(o_rubbish_id)

                                await db.models.Points_marks.create({
                                    points_id: v_point_id,
                                    marks_id: o_rubbish_id,
                                })
                            }

                        }
                        res.json({
                            message: 'Пунк сдачи отходов добавлен'
                        });
                    } else {
                        res.json({
                            message: 'Пунк сдачи отходов не может быть добавлен, нет свободных ключей'
                        });
                    }
                }
                else {
                    res.json({
                        message: 'Имя пункта приема уже используется, введите новоес'
                    });
                }
            }
            else {
                res.json({
                    message: 'Адрес уже используется, введите новый адресс'
                });
            }
        }
        catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось добавить пунк сдачи отходов'
            });
        }
    },

    editPoints: async (req, res) => {
        try {
            const v_point_id = await db.models.Points.findOne({
                where: { id: req.params.id }
            })

            if (v_point_id != null) {
                const o_points_up = await db.models.Points.update({
                    time_of_work: req.body.time_of_work,
                },
                    { where: { id: req.params.id } })

                res.json({
                    message: 'Время работы изменено'
                });
            } else {
                res.json({
                    message: 'Точки сбора отходов не сущестует'
                });
            }

        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось изменить точку сбора отходов'
            });
        }
    },

    editPointsKey: async (req, res) => {
        try {
            const v_point_key_id = await db.models.Points.findOne({
                attributes: ["key_id"],
                where: { id: req.params.id }
            })

            const v_last_id_k = await db.models.Keys.findOne({
                order: [['id', 'DESC']],
            });
            const o_new_id_k = v_last_id_k.id + 1;

            // console.log(v_point_key_id.key_id);

            const v_key = req.body.secret_key;
            const i_sk_salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_secret_key = await bcrypt.hash(v_key, i_sk_salt);
            const v_old_key = await db.models.Keys.findOne({
                attributes: ["secret_key"],
                where: { secret_key: o_secret_key }
            });

            // console.log(v_old_key.id);

            if (v_old_key == null) {
                const new_record_keys = await db.models.Keys.create({
                    id: o_new_id_k,
                    secret_key: o_secret_key,
                    is_used: 1,
                })

                // console.log(new_record_keys.toJSON())
                // console.log(new_record_keys.null);

                await db.models.Points.update({
                    key_id: new_record_keys.null

                }, {
                    where: { id: req.params.id }
                })

                res.json({
                    message: 'Секретный ключ обновлен'
                });
            }
            else {
                res.json({
                    message: 'Такой код уже используется исправьте его'
                })
            }
        }
        catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось обновить пункт сдачи отходов'
            });
        }
    },

    deletePoints: async (req, res) => {
        try {
            const v_check_id_points = await db.models.Points.findOne({
                where: { id: req.params.id },
            })

            if (v_check_id_points != null) {
                await db.models.Points.destroy({ where: { id: req.params.id } })
                res.json({
                    message: 'Точка сбора отходов удалена'
                });
            }
            else {
                res.json({
                    message: 'Не удалось удалить точка сбора отходов',
                });
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось удалить точку сбора отходов',
            });
        }
    }
}

module.exports = PointsController