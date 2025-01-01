const db = require('../config/db')
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");


const Check_weightsController = {

    getWeight: async (req, res) => {
        try {
            const weightData = await db.models.Check_weights.findAll({
                include: [{
                    model: db.models.Marks,
                    attributes: ['rubbish']
                }],
                attributes: ['id', 'key_of_weight', 'weight'],
            });

            if (weightData.length > 0) {
                res.json({
                    message: 'Данные веса успешно получены',
                    data: weightData
                });
            } else {
                res.json({
                    message: 'Данные веса не найдены'
                });
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось получить данные веса'
            });
        }
    },
    
    addWeight: async (req, res) => {
        try {
            const i_key_of_weight = req.body.key_of_weight;
            const salt_for_key = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_key_of_weight = await bcrypt.hash(i_key_of_weight, salt_for_key);

            const v_check_key_w = await db.models.Check_weights.findOne({
                where: { key_of_weight: o_key_of_weight }
            })
            const o_rubbish = await db.models.Marks.findOne({
                attributes: ["id"],
                where: { rubbish: req.body.rubbish_w}
            })
            const v_rub_w = await db.models.Check_weights.findOne({
                where: {
                    [Op.and]: [{rubbish_id: o_rubbish.id}, {weight: req.body.weight}]
                }
            })
            if (o_rubbish == null){
                res.json({
                    message: `Такого ${req.body.rubbish_w} вида вторсырья нет сначала добавить его во вторсырье`
                });
                return;
            }
            else {
                if (v_rub_w == null) {
                    if (v_check_key_w == null) {
                        await db.models.Check_weights.create({
                            rubbish_id: o_rubbish.id,
                            weight: req.body.weight,
                            key_of_weight: o_key_of_weight,
                        })
                        res.json({
                            message: 'Ключ добавлен'
                        });
                    }
                    else{
                        res.json({
                            message: 'Ключ уже добавлен, введите новый'
                        });
                    }
                }
                else{
                    res.json({
                        message: 'Ключ уже добавлен, для этого вторсырья и веса'
                    });
                }

            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось добавить ключ для проверки веса'
            });
        }
    },

    editWeight: async (req, res) => {
        try {
            const { id, rubbish_w, weight, key_of_weight } = req.body;
            const salt_for_key = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_key_of_weight = await bcrypt.hash(key_of_weight, salt_for_key);

            const o_rubbish = await db.models.Marks.findOne({
                attributes: ["id"],
                where: { rubbish: rubbish_w }
            });

            if (o_rubbish == null) {
                res.json({
                    message: `Такого ${rubbish_w} вида вторсырья нет, сначала добавьте его во вторсырье`
                });
                return;
            }

            const existingRecord = await db.models.Check_weights.findOne({
                where: { id }
            });

            if (existingRecord) {
                await db.models.Check_weights.update({
                    rubbish_id: o_rubbish.id,
                    weight,
                    key_of_weight: o_key_of_weight,
                }, {
                    where: { id }
                });

                res.json({
                    message: 'Запись успешно обновлена'
                });
            } else {
                res.json({
                    message: 'Запись не найдена'
                });
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось обновить запись'
            });
        }
    }
}
module.exports = Check_weightsController