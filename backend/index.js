// packages
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

// Utils
import connectDb from './config/db.js'

//------------------Identify the suitable port (dedicated and an optional port)-----------------
const PORT = process.env.PORT || 5000;

dotenv.config();
//-----------------------Create an instance of express application-------------------------------
const app = express();

//------------------------------Connect to online database---------------------------------------
connectDb(app);

//-------------------------------------Middleware------------------------------------------------

// middleware to parse json
app.use(express.json());
// middleware to parse data forms
app.use(express.urlencoded({extended: true}));
// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

//----------------------------------------Listen to port--------------------------------------------
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

//---------------------------------Test HTTP request-----------------------------------------
app.get('/', (req, res) =>{
    res.send("Hello world!")
})