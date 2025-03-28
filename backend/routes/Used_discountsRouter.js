const express = require('express')
const Used_discountsController = require("../controllers/Used_discountsController");
const checkRole = require('../middleware/checkRole');
const checkAuth = require('../middleware/checkAuth');

let router = express.Router()

// router.get("/discounts/used",     checkAuth, Used_discountsController.showMyDiscounts)
// router.put("/discounts/used/:id", checkAuth, Used_discountsController.usedDiscounts)

module.exports = router