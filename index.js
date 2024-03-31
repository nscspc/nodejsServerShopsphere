console.log("Hello World");

// IMPORTS FROM PACKAGES
const express = require('express'); // it is like importing packages in flutter :- import 'package:flutter/material.dart'; => import 'package:express/express.dart';
const mongoose = require('mongoose');
const cors = require("cors");

// IMPORTS FROM OTHER FILES
const authRouter = require('./routes/auth'); // import 'packages:flutter/screens/auth.dart'; => // Relative Importing like this is used in javascript => import './features/auth/screens/auth_screen.dart
const adminRouter = require('./routes/admin'); // import 'packages:flutter/screens/auth.dart'; => // Relative Importing like this is used in javascript => import './features/auth/screens/auth_screen.dart
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// INIT
const PORT = 3000;
const app = express();
const DB = "mongodb+srv://saininaveen933:naveen1234@cluster0.zm3klyk.mongodb.net/?retryWrites=true&w=majority";

// middleware => This scenerio in communication is :- CLIENT -> SERVER -> CLIENT , but if there is modification in the data and all then the scenerio is :- CLIENT -> middleware -> SERVER -> CLIENT .
app.use(express.json()); // it parses incoming request with json format(payloads).
app.use(cors());// cors() adds header to the response from the api , so that api can be called from every place.
// without using cors() , there will be XMLHttpRequest error.
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);


// Connections
mongoose.connect(DB).then(() => {
    console.log('Connection Successful');
}).catch((e) => {
    console.log(e);
});


// CREATING AN API
// GET , PUT , POST , DELETE , UPDATE => CRUD

// http://<yourIpAddress>/hello-world
// app.get('/hello-world', (req , res) => {
//     // res.send("hello world");
//     res.json({hi:"hello world"});
// });

app.listen(PORT , "0.0.0.0" , () => { // as the android devices will not able to access , so we will define the IP(this IP(0.0.0.0) can be accessible to any device).
    // console.log('connected at port ' + PORT);
    console.log(`connected at port ${PORT}`); // `(BackTick) is used to implement string interpolation( ${PORT} ). 
}); 