const db = require('../config/db');
const bcrypt = require('bcrypt');

const KeysController = {
    addKeys: async (req, res) => {
        try {
            const v_secret_key = req.body.secret_key;

            // Проверка длины ключа
            if (v_secret_key.length < 6) {
                return res.status(400).json({
                    message: 'Ключ слишком короткий',
                });
            }

            const i_sk_salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_secret_key = await bcrypt.hash(v_secret_key, i_sk_salt);

            // Проверка существования ключа
            const v_check_keys = await db.models.Keys.findOne({
                where: { secret_key: o_secret_key },
            });

            if (v_check_keys) {
                return res.status(400).json({
                    message: 'Такой ключ уже существует, введите другой',
                });
            }

            // Создание нового ключа
            await db.models.Keys.create({
                secret_key: o_secret_key,
                is_used: req.body.is_used,
            });

            res.status(201).json({
                message: 'Ключ добавлен',
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Не удалось добавить ключ',
            });
        }
    },
};

module.exports = KeysController;