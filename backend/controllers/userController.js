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
  const { email, password } = req.body;

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
    } else{
      res.status(404)
      throw new Error("User not found");
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout succesfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  //--Provide an empty object to get all users
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  //--Get the user
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else{
    res.status(404)
    throw new Error("User not found.")
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    //--IF the user provided a username, then add it. Else use the previous username
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      //--encrypt the req password 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })

  } else{
    res.status(404)
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  //--Check for exisitng users
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error("Cannot delete Admin");
    }

    //--Delete one user
    await User.deleteOne({_id: user._id})
    res.json({message: "user removed"})
    
  }else{
    res.status(404)
    throw new Error("User not found")
  }
});

const getUserById= asyncHandler(async (req, res) => {
  //--Get the user except the password
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user)
  }else{
    res.status(404)
    throw new Error("User not found")
  }

});

const updateUserById = asyncHandler(async(req, res,) =>{
  //--Get the user
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })

  } else{
    res.status(404)
    throw new Error("User not found ")
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById
};
