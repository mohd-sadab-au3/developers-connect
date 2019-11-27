let express = require('express');
const { check, validationResult } = require('express-validator');
let router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("config");

//@desc   Route api/user
//@protected route
router.get("/", auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password');

        console.log(user);

        res.json(user);



    } catch (error) {

        res.status(500).json([{ msg: "Database Error" }]);
    }

});


router.post("/", [

    check('email', 'Enter valid Email').isEmail(),
    check('password', 'Password is required').exists()

],
    async (req, res) => {

        console.log(req.body);
        const error = validationResult(req);

        if (!error.isEmpty()) {

            return (res.status(400).json({ error: error.array() }));
        }

        try {

            //pulling the fields from body
            const { email, password } = req.body;

            //checking whether user already exist or not
            let [user] = await User.find({ email });
            if (!user) {
                return res.status(400).json({ error: [{ "msg": "User name or password is wrong" }] });
            }


            //verifying the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: [{ "msg": "User name or password is wrong" }] });
            }


            //return json webtoken
            const payload = {
                user: {
                    id: user.id
                }
            }


            jwt.sign(
                payload,
                Buffer.from(config.get('jwtSecret'), 'base64').toString('ascii'),
                { expiresIn: 36000 },
                function (error, token) {
                    if (error)
                        throw error;

                    return res.json({ token });
                })

        } catch (err) {

            console.log(err);

            res.status(500).json({ error: err.array() });
        }
    });

module.exports = router;