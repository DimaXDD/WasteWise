const db = require('../config/db')

const Promo_codesController = {
    getPromoCodes: async (req, res) => {
      try{
          const promo_codes = await db.models.Promo_codes.findAll({
              include: [{
                  model: db.models.Discounts,
                  required: true,
                  attributes: ["id", "discount"]
              }],
              where: {user_id: req.userId}
          })

          if(promo_codes==null){
              return res.json({message: 'Промокодов нет'})
          } else {
              res.json({ promo_codes })
          }
      } catch(error){
          console.log(error);
          res.json({
              message: 'Не удалось найти промокоды',
          });
      }
    },

    deletePromoCode: async (req,res) => {
        try{
            const v_check_promo_code = await db.models.Promo_codes.findOne({
                where: {id: req.params.id},
                })

            if(v_check_promo_code!=null) {
                await db.models.Promo_codes.destroy({
                    where: {id: req.params.id}
                })
                res.json({
                    message: 'Промокод удален'
                });
            }
            else {
                res.json({
                    message: 'Не удалось удалить промокод',
                });
            }
        } catch(error) {
            console.log(error);
            res.json({
                message: 'Не удалось удалить промокод',
            });
        }
    },
}

module.exports = Promo_codesController
