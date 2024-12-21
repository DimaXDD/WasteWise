const express = require('express')
const Promo_codesController = require("../controllers/Promo_codesController");
const checkAuth = require('../utils/checkAuth');

let router = express.Router()

router.get('/promo', checkAuth, Promo_codesController.getPromoCodes)
router.delete('/promo/:id', checkAuth, Promo_codesController.deletePromoCode);

module.exports = router