const db = require('../config/db')
const bcrypt = require('bcrypt')

const KeysController = {

    addKeys: async (req, res) => {
        try {
            const v_secret_key = req.body.secret_key;
            const i_sk_salt = '$2b$10$qNuSSupDD53DkQfO8wqpf.';
            const o_secret_key = await bcrypt.hash(v_secret_key, i_sk_salt);

            const v_check_keys = await db.models.Keys.findOne({
                where: { secret_key: o_secret_key },
            })

            // const v_last_id = await db.models.Keys.findOne({
            //     order: [['id', 'DESC']],
            //   });
            //
            //   const o_new_id = v_last_id.id+1;

            if (v_check_keys == null) {
                db.models.Keys.create({
                    // id: o_new_id,
                    secret_key: o_secret_key,
                    is_used: req.body.is_used,
                })
                res.json({
                    message: 'Ключ добавлен'
                });
            }
            else {
                res.json({
                    message: 'Такой ключ уже существует, введите другой'
                });
            }

        } catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось добавить ключ'
            });

        }
    }
}

module.exports = KeysController