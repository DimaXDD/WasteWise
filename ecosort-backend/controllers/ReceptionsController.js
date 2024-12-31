const db = require('../config/db')
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");

const ReceptionsController = {
    Receptions: async (req, res) => {
        try {
            // Считываем ключ станции
            const i_station_key = req.body.station_key;
            const salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_station_key = await bcrypt.hash(i_station_key, salt);

            // Находим запись по ключу станции
            const v_find_key = await db.models.Keys.findOne({
                where: { secret_key: o_station_key }
            });

            if (!v_find_key || v_find_key.is_used !== 1) {
                return res.status(400).json({
                    message: 'Ключ станции недействителен'
                });
            }

            // Находим пункт приема
            const v_find_key_point = await db.models.Points.findOne({
                where: { key_id: v_find_key.id }
            });

            if (!v_find_key_point) {
                return res.status(400).json({
                    message: 'Станция с таким ключом не найдена'
                });
            }

            // Считываем ключ для проверки веса
            const i_key_of_weight = req.body.key_of_weight;
            const o_key_of_weight = await bcrypt.hash(i_key_of_weight, salt);

            // Находим запись по ключу веса
            const v_check_key_w = await db.models.Check_weights.findOne({
                attributes: ["id", "rubbish_id", "weight", "is_used"],
                where: { key_of_weight: o_key_of_weight }
            });

            if (!v_check_key_w) {
                return res.status(400).json({
                    message: 'Ключ веса недействителен'
                });
            }

            // Проверка, был ли уже использован ключ веса
            if (v_check_key_w.is_used === 1) {
                return res.status(400).json({
                    message: 'Ключ веса уже использован'
                });
            }

            // Получаем данные о вторсырье
            const v_rubbish = await db.models.Marks.findOne({
                attributes: ["id", "rubbish", "points_per_kg", "new_from_kg"],
                where: { id: v_check_key_w.rubbish_id }
            });

            if (!v_rubbish) {
                return res.status(400).json({
                    message: 'Вид вторсырья не найден'
                });
            }

            // Рассчитываем начисление баллов
            const v_weight = v_check_key_w.weight;
            const o_new_points = v_weight * v_rubbish.points_per_kg;
            const o_new_kg = v_weight * v_rubbish.new_from_kg;

            // Находим текущие баллы пользователя
            const i_user_points = await db.models.Users.findOne({
                attributes: ["points"],
                where: { id: req.userId }
            });

            if (!i_user_points) {
                return res.status(400).json({
                    message: 'Пользователь не найден'
                });
            }

            // Обновляем баллы пользователя
            const o_new_points_user = o_new_points + i_user_points.points;
            await db.models.Users.update({
                points: o_new_points_user
            }, {
                where: { id: req.userId }
            });

            // Отметим ключ веса как использованный
            await db.models.Check_weights.update({
                is_used: 1
            }, {
                where: { id: v_check_key_w.id }
            });

            // Создаем запись в receptions
            await db.models.Receptions.create({
                user_id: req.userId,
                accrued: o_new_points,
                new_kg: o_new_kg,
                weight: v_weight,
                type_waste: v_rubbish.id,
                station_key: v_find_key.id,
                weight_key: v_check_key_w.id
            });

            // Отправляем успешный ответ
            res.json({
                o_new_kg,
                o_new_points,
                o_new_points_user,
                message: 'Ваши баллы успешно начислены',
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Не удалось начислить баллы. Попробуйте ещё раз.'
            });
        }
    }
}

module.exports = ReceptionsController;
