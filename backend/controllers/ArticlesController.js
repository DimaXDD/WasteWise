const db = require('../config/db')
const { Op } = require("sequelize");
const logger = require('../middleware/logger');

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
                }]
            });
    
            if (article.length === 0) {
                logger.warning('No articles found in the database.');
                return res.json({ message: 'Статей нет' });
            } else {
                logger.success(`Fetched ${article.length} article(s) successfully.`);
                res.json({ articles: article });
            }
        } catch (error) {
            logger.error(`Error fetching articles: ${error.message}`);
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
                logger.warning(`Article with ID ${req.params.id} not found.`);
                res.json({
                    message: 'Не удалось найти статью',
                });
            }
            else {
                logger.success(`Article with ID ${req.params.id} fetched successfully.`);
                res.set("Content-Type", "application/json")
                res.send(JSON.stringify(article))
                console.log(JSON.stringify(article))
            }
        } catch (error) {
            logger.error(`Error fetching article with ID ${req.params.id}: ${error.message}`);
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
                logger.info(`Attempting to add article with title: ${req.body.title}`);

                if (v_b_image_url != undefined) {
                    const article = await db.models.Articles.create({
                        author: req.userId,
                        title: req.body.title,
                        text: req.body.text,
                        image_url: req.body.image_url,
                        date_of_pub: Date.now(),
                    })
                    logger.success(`Article with title "${req.body.title}" added with image.`);
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
                    logger.success(`Article with title "${req.body.title}" added without image.`);
                    res.json({
                        article,
                        message: 'Статья добавлена без картинки'
                    });
                }
            }
            else {
                logger.warning(`Article with title "${req.body.title}" already exists.`);
                res.json({
                    message: 'Статья с таким названием уже существует'
                });
            }
        } catch (err) {
            logger.error(`Error adding article: ${err.message}`);
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
                logger.success(`Article with ID ${req.params.id} deleted successfully.`);
                res.json({
                        message: 'Статья удалена'
                    });
            }
            else {
                logger.warning(`No article found with ID ${req.params.id}.`);
                res.json({
                        message: 'Не удалось удалить статью',
                    });
            }
        } catch (error) {
            logger.error(`Error deleting article with ID ${req.params.id}: ${error.message}`);
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
                logger.success(`Article with ID ${req.params.id} updated successfully.`);
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
                logger.success(`Article with ID ${req.params.id} updated with image.`);
                res.json({
                    article,
                    message: 'Статья изменена'
                });
            }
        } catch (err) {
            logger.error(`Error updating article with ID ${req.params.id}: ${err.message}`);
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
                logger.info(`User ${i_user} liked article ${i_article}`);
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
                    logger.success(`Article ${i_article} likes updated. Total likes: ${count_of_likes.count}`);
                    res.json({
                        message: "Вы поставили лайк",
                        expense
                    });
                })
            }
            else {
                logger.info(`User ${i_user} removed like from article ${i_article}`);
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
                    logger.success(`Article ${i_article} likes updated after unliking. Total likes: ${count_of_likes.count}`);
                    res.json({
                        message: "Вы убрали лайк",
                        expense
                    });
                })
            }
        } catch (error) {
            logger.error(`Error processing like action for article ${req.params.id}: ${error.message}`);
            res.json({
                message: 'Не удалось найти статью',
            });
        }
    },
}
module.exports = ArticlesController