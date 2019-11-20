let express = require('express');

let router = express.Router();


//@get Route
router.get("/", (req, res) => {

    res.send("Post route");
});

module.exports = router;