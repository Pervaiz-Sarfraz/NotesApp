import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./route/User.js";
import Notes from "./route/Notes.js";
import path from 'path';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get('/',(req, res)=>{
    res.send('api is running....');
})

app.use('/api/auth', User); 
app.use('/api', Notes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
  });