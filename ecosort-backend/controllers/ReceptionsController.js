const db = require('../config/db')
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");

const ReceptionsController = {
    Receptions: async (req, res) => {
        try {
            const i_station_key = req.body.station_key;
            const salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_station_key = await bcrypt.hash(i_station_key, salt)

            // Проверяем ключ
            const v_find_key = await db.models.Keys.findOne({
                where: { secret_key: o_station_key }
            })

            //Если он существует проверяем закреплен ли он за конкретным пунктом сдачи
            if (v_find_key.is_used == 1) {
                const v_find_key_point = await db.models.Points.findOne({
                    where: { key_id: v_find_key.id }
                })

                //Проверям ключ веса
                if (v_find_key_point != null) {
                    const i_key_of_weight = req.body.key_of_weight;
                    const salt_for_key = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
                    const o_key_of_weight = await bcrypt.hash(i_key_of_weight, salt_for_key);

                    const v_check_key_w = await db.models.Check_weights.findOne({
                        attributes: ["id", "rubbish_id", "weight"],
                        where:
                            { key_of_weight: o_key_of_weight },
                    })

                    if (v_check_key_w != null) {
                        const v_rubbish = await db.models.Marks.findOne({
                            attributes: ["id", "rubbish", "points_per_kg", "new_from_kg"],
                            where: { id: v_check_key_w.rubbish_id }
                        })

                        const v_weight = v_check_key_w.weight;
                        const o_new_points = v_weight * v_rubbish.points_per_kg;
                        const o_new_kg = v_weight * v_rubbish.new_from_kg;

                        const i_user_points = await db.models.Users.findOne({
                            attributes: ["points"],
                            where: { id: req.userId }
                        })

                        const o_new_points_user = o_new_points + i_user_points.points

                        db.models.Users.update({
                            points: o_new_points_user
                        }, {
                            where: { id: req.userId }
                        })

                        db.models.Receptions.create({
                            user_id: req.userId,
                            accrued: o_new_points,
                            new_kg: o_new_kg,
                            weight: v_weight,
                            type_waste: v_rubbish.id,
                            station_key: v_find_key.id,
                            weight_key: v_check_key_w.id
                        })

                        const v_find_used = await db.models.Keys.findOne({
                            where: { is_used: 0 }
                        })

                        await db.models.Points.update({
                            key_id: v_find_used.id
                        }, { where: { id: v_find_key_point.id } })

                        console.log(v_find_used)
                        await db.models.Keys.update({
                            is_used: 1,
                        }, { where: { id: v_find_used.id } })

                        res.json({
                            o_new_kg,
                            o_new_points,
                            o_new_points_user,
                            message: 'Ваши баллы начислены',
                        });
                    }
                    else {
                        res.json({
                            message: 'Ключ веса не действителен'
                        });
                    }
                }
                else {
                    res.json({
                        message: 'Ключ не действителен'
                    });
                }
            }
            else {
                res.json({
                    message: 'Ключ не действителен'
                });
            }
        }
        catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось начислить баллы'
            });
        }
    },
}
module.exports = ReceptionsController