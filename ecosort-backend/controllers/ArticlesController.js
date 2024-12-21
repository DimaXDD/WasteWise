const db = require('../config/db')
const { Op } = require("sequelize");

// const { dirname } = require('path')
// const path = require('path')
// const { fileURLToPath } = require('url')

const ArticlesController = {

    getArticles: async (req, res) => {
        try {
            const article = await db.models.Articles.findAll({
                attributes: ["id", "title", "text", "date_of_pub", "image_url", "likes"],
                order: [['id', 'DESC']],
                include: [{
                    model: db.models.Users,
                    required: true,
                    attributes: ["id", "username"]
                }]})
            if (!article) {
                return res.json({ message: 'Статей нет' })
            }
            else {
                res.json({ article })
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти статьи',
            });
        }
    },

    // getArticlesRating: async (req, res) => {
    //     try {
    //         db.models.Ratings.findAll({
    //             attributes: ["id", "Comment", "Item", "Commentator"],
    //             include: [{
    //                 model: db.models.Articles,
    //                 required: true,
    //                 attributes: ["id", "title", "text", "date_of_pub", "image_url", "like"],
    //                 include: [{
    //                     model: db.models.Users,
    //                     required: true,
    //                     attributes: ["id", "username"]
    //                 }]
    //             }]
    //         })
    //         .then(expense => {res.send(JSON.stringify(expense)), console.log(JSON.stringify(expense))})
    //     } catch (error) {
    //         console.log(error);
    //         res.json({
    //             message: 'Не удалось найти статьи',
    //         });
    //     }
    // },

    getArticle: async (req, res) => {
        try {
            const article = await db.models.Articles.findOne({
                attributes: ["id", "title", "text", "date_of_pub", "image_url", "likes"],
                include: [{
                    model: db.models.Users,
                    required: true,
                    attributes: ["id", "username"]
                }],
                where: { id: req.params.id }
            }
            )
            if (article == null) {
                res.json({
                    message: 'Не удалось найти статью',
                });
            }
            else {
                res.set("Content-Type", "application/json")
                res.send(JSON.stringify(article))
                console.log(JSON.stringify(article))
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти статью',
            });
        }
    },

    addArticles: async (req, res) => {
        try {
            const v_check_title = await db.models.Articles.findOne({
                where: { title: req.body.title },
            })

            const v_b_image_url = req.body.image_url;
            if (v_check_title == null) {
                if (v_b_image_url != undefined) {
                    const article = await db.models.Articles.create({
                        author: req.userId,
                        title: req.body.title,
                        text: req.body.text,
                        image_url: req.body.image_url,
                        date_of_pub: Date.now(),
                    })
                    res.json({
                        article,
                        message: 'Статья добавлена с картинкой'
                    });
                }
                else {
                    const article = await db.models.Articles.create({
                        author: req.userId,
                        title: req.body.title,
                        text: req.body.text,
                        image_url: '',
                        date_of_pub: Date.now(),
                    })
                    res.json({
                        article,
                        message: 'Статья добавлена без картинки'
                    });
                }
            }
            else {
                res.json({
                    message: 'Статья с таким названием уже существует'
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось добавить статью'
            });
        }
    },

    deleteArticles: async (req, res) => {
        try {
            const v_check_id_articles = await db.models.Articles.findOne({
                where: { id: req.params.id },
            })
            if (v_check_id_articles != null) {
                const article = await db.models.Articles.destroy({ where: { id: req.params.id } })
                res.json({
                        message: 'Статья удалена'
                    });
            }
            else {
                res.json({
                        message: 'Не удалось удалить статью',
                    });
            }
        } catch (error) {
            console.log(error);
            res.json({
                    message: 'Не удалось удалить статью',
                });
        }
    },

    updateArticles: async (req, res) => {
        try {
            const v_check_u_title = await db.models.Articles.findOne({
                where: { title: req.body.title },
            })
            const v_u_image_url = req.body.image_url
            if (v_u_image_url == undefined) {
                const article = await db.models.Articles.update({
                    title: req.body.title,
                    text: req.body.text,
                    date_of_pub: Date.now(),
                    image_url: req.body.image_url,
                }, {
                    where: { id: req.params.id }
                })
                res.json({
                    article,
                    message: 'Статья изменена'
                });
            }
            else {
                const article = await db.models.Articles.update({
                    title: req.body.title,
                    text: req.body.text,
                    date_of_pub: Date.now(),
                    image_url: req.body.image_url
                }, {
                    where: { id: req.params.id }
                })
                res.json({
                    article,
                    message: 'Статья изменена'
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось изменить статью'
            });
        }
    },

    like: async (req, res) => {
        try {
            const i_user = req.userId
            const i_article = req.params.id
            const v_likes = await db.models.Likes.findOne({
                where: {
                    [Op.and]: [{ user_id: i_user }, { article_id: i_article }],
                }
            })
            if (!v_likes) {
                const likes = await db.models.Likes.create({
                    user_id: i_user,
                    article_id: i_article,
                })
                const count_of_likes = await db.models.Likes.findAndCountAll({
                    attributes: ['article_id'],
                    where: { article_id: i_article }
                })
                const update_like = await db.models.Articles.update({
                    likes: count_of_likes.count
                }, {
                    where: { id: req.params.id }
                })
                db.models.Articles.findAll({
                    attributes: ["id", "title", "text", "date_of_pub", "image_url", "likes"],
                    include: [{
                        model: db.models.Users,
                        required: true,
                        attributes: ["id", "username"]
                    }]
                }).then(expense => {
                    res.json({
                        message: "Вы поставили лайк",
                        expense
                    });
                })
            }
            else {
                const likes = await db.models.Likes.destroy({
                    where: {
                        [Op.and]: [{ user_id: i_user }, { article_id: i_article }],
                    }
                })
                const count_of_likes = await db.models.Likes.findAndCountAll({
                    attributes: ['article_id'],
                    where: { article_id: i_article }
                })
                const update_like = await db.models.Articles.update({
                    likes: count_of_likes.count
                }, {
                    where: { id: req.params.id }
                })
                db.models.Articles.findAll({
                    attributes: ["id", "title", "text", "date_of_pub", "image_url", "likes"],
                    include: [{
                        model: db.models.Users,
                        required: true,
                        attributes: ["id", "username"]
                    }]
                }).then(expense => {
                    res.json({
                        message: "Вы убрали лайк",
                        expense
                    });
                })
            }
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти статью',
            });
        }
    },
}
module.exports = ArticlesController