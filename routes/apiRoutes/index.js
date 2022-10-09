const express = require("express");
const router = express.Router();

router.use(require("./candidateRoutes"));
router.use(require("./partyRoutes"));
router.use(require("./voterRoutes"));
// tell router object to use the votes route alongside the others
router.use(require("./voteRoutes"));

module.exports = router;
