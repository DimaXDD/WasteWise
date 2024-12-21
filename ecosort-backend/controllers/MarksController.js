const db = require('../config/db')

const MarksController = {

    getMarks: async (req, res) => {
        try {
            const marks = await db.models.Marks.findAll({
                attributes: ["id", "rubbish", "points_per_kg", "new_from_kg", "image_link"],
            })
            if (!marks) {
                return res.json({ message: "Вротсырья нет" })
            }
            else {
                res.json({ marks })
            }
            // .then(expense => {
            //     res.set("Content-Type", "application/json");
            //     res.send(JSON.stringify(expense)),
            //     console.log(JSON.stringify(expense))})
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти вротсырье',
            });
        }
    },

    getMark: async (req, res) => {
        try {
            const marks = await db.models.Marks.findOne({
                attributes: ["id", "rubbish", "points_per_kg", "new_from_kg", "image_link"],
                where: { id: req.params.id }
            })

            if (marks == null) {
                res.json({
                    message: 'Не удалось найти вротсырье',
                });
            }
            else {
                res.set("Content-Type", "application/json")
                res.send(JSON.stringify(marks))
                console.log(JSON.stringify(marks))
            }
        }
        catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось найти вротсырье',
            });
        }
    },

    addMarks: async (req, res) => {
        try {
            const v_check_marks = await db.models.Marks.findOne({
                where: { rubbish: req.body.rubbish },
            })

            if (v_check_marks == null) {
                await db.models.Marks.create({
                    rubbish: req.body.rubbish,
                    points_per_kg: req.body.points_per_kg,
                    new_from_kg: req.body.new_from_kg,
                    image_link: req.body.image_link,
                })
                res.json({
                    message: 'Вторсырье добавлено'
                });
            }
            else {
                res.json({
                    message: 'Такое вротсырье уже есть, введите новое',
                });
            }
        } catch (err) {
            console.log(err);
            res.json({
                message: 'Не удалось добавить вротсырье'
            });
        }
    },

    editMarks: async (req, res) => {
        try {
            await db.models.Marks.update({
                rubbish: req.body.rubbish,
                points_per_kg: req.body.points_per_kg,
                new_from_kg: req.body.new_from_kg,
                image_link: req.body.image_link,
            }, { where: { id: req.params.id } })

            res.json({
                message: 'Вротсырье обновлено'
            });
        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось обновить вротсырье'
            });
        }
    },

    deleteMarks: async (req, res) => {
        try {
            const v_check_id_marks = await db.models.Marks.findOne({
                where: { id: req.params.id },
            })

            if (v_check_id_marks != null) {
                await db.models.Marks.destroy({ where: { id: req.params.id } })
                res.json({
                    message: 'Вротсырье удалено'
                });
            }
            else {
                res.json({
                    message: 'Не удалось удалить вротсырье',
                });
            }

        } catch (error) {
            console.log(error);
            res.json({
                message: 'Не удалось удалить вротсырье',
            });

        }
    }
}

module.exports = MarksController