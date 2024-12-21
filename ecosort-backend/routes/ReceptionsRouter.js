const express = require('express')
const ReceptionsController = require("../controllers/ReceptionsController");
const checkAuth = require('../utils/checkAuth');

// const ValidError = require('../utils/HandleErrors');
// const validator = require('../validations/ReceptionsValidations');

let router = express.Router()

router.post('/receptions', checkAuth, ReceptionsController.Receptions);


// router.post('/Receptions', validator.Receptions, ValidError, chekAuth, ReceptionsController.Receptions);
// router.get('/Receptions', chekAuth, ReceptionsController.getReceptions);

module.exports = router