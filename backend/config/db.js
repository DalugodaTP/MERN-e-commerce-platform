import mongoose from "mongoose";

const connectDB = async () => {

  //-------------------Connect to online database using clustername and database name-------------------
  mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch(() => {
    console.log("Connection to DB failed!");
  });
};

export default connectDB;
