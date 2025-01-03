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
    
            // Находим вид вторсырья по запросу
            const o_rubbish = await db.models.Marks.findOne({
                attributes: ["id"],
                where: { rubbish: req.body.rubbish_w }
            });
    
            if (o_rubbish == null) {
                // Если вид вторсырья не найден, возвращаем сообщение
                res.json({
                    message: `Такого вида вторсырья (${req.body.rubbish_w}) нет, сначала добавьте его в список`
                });
                return;
            }
    
            // Проверка, не существует ли уже запись с таким ключом
            const v_check_key_w = await db.models.Check_weights.findOne({
                where: { key_of_weight: o_key_of_weight }
            });
    
            if (v_check_key_w != null) {
                // Если ключ уже существует, возвращаем сообщение
                res.json({
                    message: 'Этот ключ уже добавлен, введите новый'
                });
                return;
            }
    
            // Записываем новый ключ с указанным видом и весом
            await db.models.Check_weights.create({
                rubbish_id: o_rubbish.id,
                weight: req.body.weight,
                key_of_weight: o_key_of_weight,
            });
    
            // Возвращаем успешное сообщение
            res.json({
                message: 'Ключ успешно добавлен'
            });
    
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