const mongoose = require("mongoose");
const { productSchema } = require("./product");

const userSchema = mongoose.Schema({ //schema is the structure of model.
  name: {
    required: true, // it means that it is necessary to provide name in body.
    type: String, // javascript is dynamically typed language , but here we are creating the model for mongoose so that's why we have to mention the type of information we are going to store using schema in mongodb.
    trim: true, // ' Nav ' -> 'Nav' // trim property is used to remove leading and trailing spaces.
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {// regex(Regular Expression) is the sequence of characters that specify a search pattern in a text.
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address", // this will run if the value(email syntax) is not valid.
    },
  },
  password: {
    required: true,
    type: String,
    // validate: {
    //   validator: (value) => {
    //     return value.length > 6;
    //   },
    //   message: "Please enter a long password",
    // },
  },
  address: {
    type: String,
    default: "",// we have specified the address as an empty string , as we are not going to take the address as input while signup or signin.
  },
  type: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema); // to create model using the schema. & "User" is the name of the model.
module.exports = User;
