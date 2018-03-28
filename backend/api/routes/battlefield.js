const express = require("express");
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');
const BattlefieldController = require('../controllers/battlefield');

router.get("/", checkAuth, BattlefieldController.mapData);

module.exports = router;