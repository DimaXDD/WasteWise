const express = require('express')
const Check_weightsController = require("../controllers/Check_weightsController");
const checkAuth = require('../utils/checkAuth');
const checkRole = require('../utils/checkRole');
const validator = require("../validations/MarksValidations");
const ValidError = require("../utils/HandleErrors");

let router = express.Router()

router.post('/weight',  checkRole, checkAuth, validator.AddWeight, ValidError, Check_weightsController.addWeight);

module.exports = router