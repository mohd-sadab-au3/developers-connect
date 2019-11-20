let express = require('express');

let router = express.Router();


//@get Route
router.get("/", (req, res) => {

    res.send("auth route");
});

module.exports = router;