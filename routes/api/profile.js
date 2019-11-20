let express = require('express');

let router = express.Router();


//@get Route
router.get("/", (req, res) => {

    res.send("profile route");
});

module.exports = router;