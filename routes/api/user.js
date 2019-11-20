let express = require('express');
const { check, validationResult } = require('express-validator');
let router = express.Router();
let User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require("config");

//@desc  Post api/user
router.post("/", [

    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Enter valid Email').isEmail(),
    check('password', 'Min 6 character password is required').isLength({ min: 6 })

],
    async (req, res) => {

        console.log(req.body);
        const error = validationResult(req);

        if (!error.isEmpty()) {

            return (res.status(400).json({ error: error.array() }));
        }

        try {

            //pulling the fields from body
            const { name, email, password } = req.body;

            //checking whether user already exist or not
            let [user] = await User.find({ email });
            if (user) {
                return res.status(400).json({ error: [{ "msg": "User already exist" }] });
            }

            //Get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            user = {
                name,
                email,
                password,
                avatar
            }

            //Encrypt the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //saving in database
            user = await User.create(user);



            //return json webtoken
            const payload = {
                user: {
                    id: user.id
                }
            }


            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                function (error, token) {
                    if (error)
                        throw error;

                    return res.json({ id: user.id, token });
                })

        } catch (err) {

            console.log(err);

            res.status(500).json({ error: err.array() });
        }
    });

module.exports = router;