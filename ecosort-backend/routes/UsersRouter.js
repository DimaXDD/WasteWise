const express = require('express')
const UsersController = require("../controllers/UsersController");
const checkRole = require('../utils/checkRole');
const checkAuth = require("../utils/checkAuth");
const validator = require("../validations/AuthValidations");
const ValidError = require("../utils/HandleErrors");

let router = express.Router()

router.get('/User', checkAuth, UsersController.getUser);
router.put('/user', validator.changeUsername, ValidError, UsersController.changeUsername);
router.put('/user/pass', UsersController.changePass);

module.exports = router