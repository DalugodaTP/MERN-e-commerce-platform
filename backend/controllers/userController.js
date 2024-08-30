import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  //------------------Validation--------------------
  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs");
  }
  //---------------Check existing users-------------
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User already exists");
  }

  //----------Create salt and hash the password------
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //-----------------Create a user ------------------
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    //--Create token
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  //--Checking for exisiting users in the db----
  const existingUser = await User.findOne({ email });

  //--After confirming the user exist
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      //--Create a token and set to headers as a cookie
      createToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return; //Exit the function after sending the response
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '',{
        httpOnly:true,
        expires: new Date(0),
    });

    res.status(200).json({message:"Logout succesfully"});
    
});

export { createUser, loginUser,logoutCurrentUser };
