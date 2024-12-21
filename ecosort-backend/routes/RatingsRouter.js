const express = require('express')
const RatingsController = require("../controllers/RatingsController");
const checkAuth = require('../utils/checkAuth');
const checkRole = require("../utils/checkRole");

// const ValidError = require('../utils/HandleErrors');
// const validator = require('../validations/RatingsValidations');

let router = express.Router()

router.get   ('/ratings/:article_id',            RatingsController.getRatings);
router.get   ('/ratings',                        RatingsController.getAllRating);
router.post  ('/ratings/:article_id', checkAuth, RatingsController.addRatings);
router.delete('/ratings/:id',         checkAuth, RatingsController.deleteRatings);
// router.delete('/ratings/admin/:id',   checkRole, RatingsController.deleteRatingsAdmin);

// router.post('/Ratings/:article_id', chekAuth, validator.addRatings, ValidError, RatingsController.addRatings);

module.exports = router