const express = require('express')
const DiscountsController = require("../controllers/DiscountsController");
const validator = require('../validations/DiscountsValidations');
const checkRole = require('../utils/checkRole');
const ValidError = require('../utils/HandleErrors');
const checkAuth = require("../utils/checkAuth");

let router = express.Router()

router.get   ('/discounts',          checkRole, DiscountsController.getDiscounts);
router.get   ('/discounts/:id',      checkRole, DiscountsController.getDiscount);
router.get   ('/used/discounts',     checkAuth, DiscountsController.showMyDiscounts)
router.put   ('/discounts/:id',      checkRole, DiscountsController.editDiscounts);
router.put   ("/used/discounts/:id", checkAuth, DiscountsController.usedMyDiscounts)
router.delete('/discounts/:id',      checkRole, DiscountsController.deleteDiscounts);
router.post  ('/discounts',          checkRole, validator.addDiscounts, ValidError, DiscountsController.addDiscounts);

// router.get('/DiscountU',  chekAuth, DiscountsController.getDiscountsU);
module.exports = router