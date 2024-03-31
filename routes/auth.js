const express = require('express');

const authRouter = express.Router();
const User = require("../models/user"); 
const bcryptjs = require('bcryptjs'); // to hash the password.
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// authRouter.get('/user' , (req , res) => {
//     res.json({msg:"Message"});
// });

// SIGN UP Route :-
authRouter.post('/api/signup' , async (req , res) => {
    // console.log(req.body);
    /*
    {
        'name' : name , 'email' : email , 'password' : password
    }
    */
    const {name , email , password} = req.body;

    try {
        const existingUser = await User.findOne({email}); //findOne() is a promise as it is going to return output in future as it is going to take some time.
    if(existingUser)
    {
        return res.status(400).json({msg: "User with same email already exists !"}); // 400 status code is for "Bad Request".
    }

    const hashedPassword = await bcryptjs.hash(password , 8); // 8 is the salt

    // In Javascript everything is an OBJECT , just like In Flutter everything is WIDGET.
    let user = new User({ // lel OR var because it cannot be const.
        email,
        password:hashedPassword, //password, previously it was passed like simply by "password" because the name of the parameter in User module is also "password" but now it is "hashedPassword" , so now we have to specify the parameter also.
        name,
    });

    user = await user.save();
    res.json(user);
    // weak-password , 6 characters , same-account-with-email
    // get the data from client
    // post that data in database
    // return that data to the user
    } catch (e) {
        res.status(500).json({error : e.message}); // 500 => server error
    }

    
});

// SIGN IN Route :-
authRouter.post('/api/signin' , async (req , res) => {
    // console.log(req.body);
    /*
    {
        'email' : email , 'password' : password
    }
    */
    const {email , password} = req.body;

    try {
       user = await User.findOne({email}); //findOne() is a promise as it is going to return output in future as it is going to take some time.
    if(!user)
    {
        return res.status(400).json({msg: "User with this email does not exist !"}); // 400 status code is for "Bad Request".
    }

    const isMatch = await bcryptjs.compare(password , user.password);// 2 same passwords are not going to have same hashed password as the bcrypt will hash the password with random salt.
    if (!isMatch) {
        return res.status(400).json({msg: "Incorrect Password !"});
    }

    const token = jwt.sign({id : user._id}, "passwordKey"); // to ensure that the users are who they say they are.

    res.json({token , ...user._doc});

    //res.json({ token, ...user._doc }); :-
    /*
    {
      'token' : 'tokensomething',
      'name' : 'Nav',
      'email' : 'nav@gmail.com'
    }
    */

    
    } catch (e) {
        res.status(500).json({error : e.message}); // 500 => server error
    }

    
});

// VALIDATE TOKEN
authRouter.post('/tokenIsValid' , async (req , res) => {
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.json(false);

        const verified = jwt.verify(token , 'passwordKey');
        if(!verified)
        {
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if(!user)
        {
            return res.json(false);
        }
        res.json(true);
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});

// GET USER DATA
authRouter.get('/' , authMiddleware , async (req , res) => {
    const user = await User.findById(req.user); // req.user is id of user according to the valid token.
    
    res.json({...user._doc , token : req.token});
});

module.exports = authRouter;
