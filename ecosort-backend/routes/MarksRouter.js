const express = require('express')
const MarksController = require("../controllers/MarksController");
const validator = require('../validations/MarksValidations');
const checkRole = require('../utils/checkRole');
const checkAuth = require('../utils/checkAuth');
const ValidError = require('../utils/HandleErrors');

let router = express.Router()

router.get   ('/marks',     checkAuth, MarksController.getMarks);
router.get   ('/marks/:id', checkAuth, MarksController.getMark);
router.post  ('/marks',     checkRole, validator.addMarks, ValidError, MarksController.addMarks);
router.put   ('/marks/:id', checkRole, validator.editMarks, ValidError, MarksController.editMarks);
router.delete('/marks/:id', checkRole, MarksController.deleteMarks);


module.exports = router