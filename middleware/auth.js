const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    //getting token from req header
    const token = req.header('x-auth-token');
    console.log("token", token);
    if (!token) {
        return res.status(400).json([{ msg: "No Token,autherisation denied" }]);
    }

    try {

        //verify the token 
        const decode = jwt.verify(token, Buffer.from(config.get('jwtSecret'), 'base64').toString('ascii'));

        req.user = decode.user;

        //executing next middleware
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json([{ msg: "Invalid Token,autherisation denied" }]);
    }

}