const express = require('express')
const KeysController = require("../controllers/KeysController");
const checkRole = require('../utils/checkRole');
const validator = require("../validations/PointsValidations");
const ValidError = require("../utils/HandleErrors");

let router = express.Router()

router.post('/keys', checkRole, validator.addKey, ValidError, KeysController.addKeys);

module.exports = router