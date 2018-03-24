const express = require("express");
const router = express.Router();
const checkAuth = require('../../middleware/check-auth');
const PartyController = require('../controllers/party');

router.get("/", checkAuth, PartyController.party_get_all);
router.get("/join/:partyId",checkAuth, PartyController.party_join);
router.get("/leave",checkAuth, PartyController.party_leave);
router.post("/", checkAuth, PartyController.party_create);

module.exports = router;