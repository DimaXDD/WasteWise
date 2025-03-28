const db = require('../config/db')
const { Op } = require("sequelize");


const Used_discountsController = {
    // usedDiscounts: async (req, res) => {
    //     try {
    //         const i_id_my_discount = req.params.id
    //
    //         console.log(i_id_my_discount)
    //
    //         const i_my_discount = await db.models.Used_discounts.findOne({
    //             attributes: ["discount_id"],
    //             where: { id: i_id_my_discount },
    //         })
    //
    //         console.log(i_my_discount.discount_id)
    //
    //         const i_find_my_discount = await db.models.Discounts.findOne({
    //             attributes: ["count_for_dnt"],
    //             where: { id: i_my_discount.discount_id },
    //         })
    //
    //         console.log(i_find_my_discount.count_for_dnt)
    //
    //         const v_old_points = await db.models.Users.findOne({
    //             attributes: ["points"],
    //             where: { id: req.userId }
    //         })
    //
    //         console.log(v_old_points.points)
    //
    //         const v_new_points = v_old_points.points - i_find_my_discount.count_for_dnt
    //
    //         console.log(v_new_points)
    //
    //         db.models.Users.update({
    //             points: v_new_points
    //         }, { where: { id: req.userId } })
    //
    //         const v_change_disc = db.models.Used_discounts.update({
    //             used: 1
    //         }, { where: { id: i_id_my_discount } })
    //
    //         console.log(v_change_disc)
    //
    //         res.json({
    //             message: 'Скидка использована'
    //         });
    //
    //     } catch (error) {
    //         console.log(error);
    //         res.json({
    //             message: 'Не удалось использовать скидку'
    //         });
    //     }
    //
    // },
    //
    // showMyDiscounts: async (req, res) => {
    //     try {
    //         const discounts = await db.models.Used_discounts.findAll({
    //             attributes: ["id", "discount_id"],
    //             include: [{
    //                 model: db.models.Discounts,
    //                 required: true,
    //                 attributes: ["id", "discount", "count_for_dnt", "promo_code"]
    //             }, {
    //                 model: db.models.Users,
    //                 required: true,
    //                 attributes: ["id", "points"]
    //             }
    //             ],
    //             where:
    //             {
    //                 [Op.and]: [{ user_id: req.userId }, { used: { [Op.ne]: 1 } }],
    //             }
    //         })
    //         if (!discounts) {
    //             return res.json({ message: "Скидок нет" })
    //         }
    //         else {
    //             res.json({ discounts })
    //         }
    //         // .then(expense => {res.set("Content-Type", "application/json");
    //         // res.send(JSON.stringify(expense)),
    //         // console.log(JSON.stringify(expense))})
    //     } catch (error) {
    //         console.log(error);
    //         res.json({
    //             message: 'Не удалось загрузить скидки'
    //         });
    //
    //     }
    //
    // }

}
module.exports = Used_discountsController
