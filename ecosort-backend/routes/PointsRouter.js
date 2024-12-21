const express = require('express')
const PointsController = require("../controllers/PointsController");
const checkRole = require('../utils/checkRole');
const checkAuth = require('../utils/checkAuth');
const validator = require("../validations/PointsValidations");
const ValidError = require("../utils/HandleErrors");

// const ValidError = require('../utils/HandleErrors');
// const validator = require('../validations/PointsValidations');

let router = express.Router()

router.get   ('/points',         checkAuth, PointsController.getPoints);
router.get   ('/points/:id',     checkRole, PointsController.getPoint);
router.get   ('/points/marks/:marks_id',     checkAuth, PointsController.getPointByMarks);
router.post  ('/points',         validator.addPoints, ValidError, checkRole, checkAuth, PointsController.addPoints);
router.put   ('/points/key/:id', validator.editKey, ValidError, checkRole, checkAuth, PointsController.editPointsKey);
router.put   ('/points/:id',     validator.editPoints, ValidError, checkRole, checkAuth, PointsController.editPoints);
router.delete('/points/:id',     checkRole, PointsController.deletePoints);

module.exports = router