const db = require('../config/db')

const RatingsController = {

    getRatings: async (req, res) => {
        try {
            const v_check_article = await db.models.Articles.findOne({
                where: { id: req.params.article_id }
            })

            if (v_check_article != null) {
                db.models.Ratings.findAll({
                    attributes: ["id", "article_id", "commentator", "comment", "date_of_add"],
                    order: [['id', 'DESC']],
                    include: [{
                        model: db.models.Users,
                        required: true,
                        attributes: ["id", "username"],
                    }],
                    where: { article_id: req.params.article_id }
                }).then(expense => {
                    res.set("Content-Type", "application/json");
                    res.send(JSON.stringify(expense)),
                        console.log(JSON.stringify(expense))
                })
            }
            else {
                res.json({
                    message: 'Такой статьи мы не нашли'
                });
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти рейтинг статьи'
            });
        }
    },

    getAllRating: async (req, res) => {
        try {
            db.models.Ratings.findAll({
                include: [{
                    model: db.models.Users,
                    required: true,
                    attributes: ["id", "username"],
                }],

            }
            )
                .then(expense => {
                    res.set("Content-Type", "application/json");
                    res.send(JSON.stringify(expense)),
                        console.log(JSON.stringify(expense))
                })

        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти рейтинг статьи'
            });
        }

    },

    addRatings: async (req, res) => {
        try {
            const v_check_body = req.body.comment
            if (!v_check_body) {
                res.json({
                    message: 'Введите текст комментария'
                });
            }
            else {
                const v_check_a_article = await db.models.Articles.findOne({
                    where: { id: req.params.article_id }
                })
                if (v_check_a_article != null) {
                    const comment = await db.models.Ratings.create({
                        article_id: req.params.article_id,
                        commentator: req.userId,
                        comment: req.body.comment,
                        date_of_add: Date.now(),
                    })
                    // const comment = await db.models.Ratings.findAll({
                    //     include: [{
                    //         model: db.models.Users,
                    //         required: true,
                    //         attributes: ["id", "username"],
                    //     }],
                    //     where: {article_id: req.params.article_id}})

                    res.json({
                        comment,
                        message: 'Комментарий добавлен'
                    });
                }
                else {
                    res.json({
                        message: 'Статья не существует'
                    });
                    //    501 Not Implemented («не реализовано»)
                }
            }
        } catch (err) {
            console.log(err);
            res.

                json({
                    message: 'Не удалось добавить комментарий'
                });
        }
    },

    deleteRatings: async (req, res) => {
        try {
            const v_check_comment = await db.models.Ratings.findOne({
                where: { id: req.params.id },
            })

            if (v_check_comment != null) {
                db.models.Ratings.destroy({ where: { id: req.params.id } })
                res.json({
                    message: 'Комментарий удален'
                });
            }
            else {
                res.json({
                    message: 'Не удалось удалить комментарий',
                });
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось удалить комментарий',
            });
        }
    },

    // deleteRatingsAdmin: async (req, res) => {
    //     try {
    //         const v_check_comment = await db.models.Ratings.findOne({
    //             where: { id: req.params.id },
    //         })
    //
    //         if (v_check_comment != null) {
    //             db.models.Ratings.destroy({ where: { id: req.params.id } })
    //             res.json({
    //                 message: 'Комментарий удален'
    //             });
    //         }
    //         else {
    //             res.json({
    //                 message: 'Не удалось удалить комментарий',
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         res.json({
    //             message: 'Не удалось удалить комментарий',
    //         });
    //     }
    // },

}

module.exports = RatingsController