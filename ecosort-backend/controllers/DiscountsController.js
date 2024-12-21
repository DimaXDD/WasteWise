const db = require('../config/db')
const { Op } = require("sequelize");

const DiscountsController = {
    //Admin
    getDiscounts: async (req, res) => {
        try {
            const alldiscounts = await db.models.Discounts.findAll({
                attributes: ["id", "discount", "count_for_dnt", "promo_code"],
            })

            if (!alldiscounts) {
                return res.json({ message: 'Скидок нет' })
            }

            else {
                res.json({ alldiscounts })
            }
            // .then(expense => {
            //  res.set("Content-Type", "application/json");
            //  res.send(JSON.stringify(expense)),
            //  console.log(JSON.stringify(expense))})
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти скидки',
            });
        }
    },

    //Admin
    getDiscount: async (req, res) => {
        try {
            const alldiscounts = await db.models.Discounts.findOne({
                attributes: ["id", "discount", "count_for_dnt", "promo_code"],
                where: { id: req.params.id }
            }
            )
            if (alldiscounts == null) {
                res.json({
                    message: 'Не удалось найти скидку',
                });
            }
            else {
                res.set("Content-Type", "application/json")
                res.send(JSON.stringify(alldiscounts))
                console.log(JSON.stringify(alldiscounts))
            }

        }
        catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти скидку',
            });
        }
    },

    //Admin
    addDiscounts: async (req, res) => {
        try {
            const v_check_discount = await db.models.Discounts.findOne({
                where: { discount: req.body.discount }
            })

            if (v_check_discount == null) {
                db.models.Discounts.create({
                    discount: req.body.discount,
                    count_for_dnt: req.body.count_for_dnt,
                    promo_code: req.body.promo_code
                })
                res.json({
                    message: 'Скидка добавлена'
                });
            }
            else {
                res.json({
                    message: 'Такая скидка уже существует'
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось добавить Скидку'
            });
        }
    },

    // Admin
    editDiscounts: async (req, res) => {
        try {
            const v_discount_up = await db.models.Discounts.update({
                discount: req.body.discount,
                count_for_dnt: req.body.count_for_dnt,
                promo_code: req.body.promo_code,
            }, {
                where: { id: req.params.id }
            })
            res.json({
                message: 'Скидка изменена'
            });
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось обновить скидку'
            });
        }
    },

    //Admin
    deleteDiscounts: async (req, res) => {
        try {
            const v_check_id_discounts = await db.models.Discounts.findOne({
                where: { id: req.params.id },
            })

            if (v_check_id_discounts != null) {
                await db.models.Discounts.destroy({where: {id: req.params.id}})
                res.json({
                    message: 'Скидка удалена'
                });
            }
            else {
                res.json({
                    message: 'Не удалось удалить скидку',
                });
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось удалить скидку',
            });
        }
    },

    //User DONT USE
    showMyDiscounts: async (req, res) => {
        try{

            const v_user = await db.models.Users.findOne({
                attributes: ["points"],
                where: {id: req.userId}
            })

            console.log(v_user.points);

            const alldiscounts = await db.models.Discounts.findAll({
                attributes: ["id", "discount", "count_for_dnt", "promo_code"],
                where: {count_for_dnt: { [Op.lte]: v_user.points}}
            })

            if (!alldiscounts) {
                return res.json({ message: 'Скидок нет' })
            }

            res.json({ alldiscounts })
        }
        catch (error) {
            console.log(error);
        }
    },

    //User
    usedMyDiscounts: async (req, res) => {
        try {
            const v_user = await db.models.Users.findOne({
                attributes: ["points"],
                where: {id: req.userId}
            })

            // console.log(v_user.points);

            const i_discounts = await db.models.Discounts.findOne({
                attributes: ["id", "discount", "count_for_dnt", "promo_code"],
                where: {id: req.params.id}
            })

            // console.log(i_discounts.count_for_dnt);

            const o_new_points = v_user.points - i_discounts.count_for_dnt

            // console.log(o_new_points);

            await db.models.Users.update({
                points: o_new_points,
            }, {where: {id: req.userId}})

            const v_check_promo_codes = await   db.models.Promo_codes.findOne({
                where: {
                    [Op.and]: [{ user_id: req.userId }, { discount_id: i_discounts.id }],
                }
            })

            console.log(v_check_promo_codes)
            if (v_check_promo_codes!=null) {
                await db.models.Promo_codes.update({
                        promo_code: i_discounts.promo_code,
                        date_of_add: Date.now()},
                    {where: {
                            [Op.and]: [{ user_id: req.userId }, { discount_id: i_discounts.id }],
                        }
                    })
            }
            else{
                await db.models.Promo_codes.create({
                    promo_code: i_discounts.promo_code,
                    user_id: req.userId,
                    discount_id: i_discounts.id,
                    date_of_add: Date.now(),
                })
            }

            function generateString(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    result += characters.charAt(randomIndex);
                }
                return result;
            }

            const generatedString = generateString(8);
            // console.log(generatedString);

            await db.models.Discounts.update({
                promo_code: generatedString},
                {where: {id: req.params.id}
            })

            res.json({
                o_new_points,
                message: 'Скидка использована'
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = DiscountsController
