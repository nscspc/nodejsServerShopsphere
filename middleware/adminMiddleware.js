const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminMiddleware = async(req , res , next) => {
    try {
        const token = req.header('x-auth-token');
        if(!token)
        {
            res.status(401).json({msg : 'No auth token , access denied !'});
        }

        const verified = jwt.verify(token , 'passwordKey');
        if(!verified){
            return res.status(401).json({msg : 'Token verification failed , authorization denied !'});
        }

        const user = await User.findById(verified.id);
        if(user.type == "user")
        {
            return res.status(401).json({msg : 'You are not an seller !'});
        }

        req.user = verified.id;
        req.token = token;
        next(); // to call next callback function.
    } catch (err) {
        res.status(500).json({error : err.message});
    }
}

module.exports = adminMiddleware;