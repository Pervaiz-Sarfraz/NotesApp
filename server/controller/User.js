import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import {validationResult } from 'express-validator';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {name,email,password} = req.body;
    try {
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
        })

      await user.save();

      const payload = { userId: user.id, name, email: user.email }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: user.id, name, email } });
    } catch (error) {
        console.error('Error in register:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' }); 
    }
}
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
      const payload = { userId: user.id, name: user.name, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Error in login:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}



export const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { email, name } = payload;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'User not found. Please sign up first.' });
      }
  
      const jwtPayload = { userId: user.id, name: user.name, email: user.email };
      const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.json({ token: authToken, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Google login error:', error.message);
      res.status(401).json({ message: 'Invalid Google token' });
    }
  };
  
export const googleSignup = async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { email, name } = payload;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists. Please log in.' });
      }
  
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
  
      const jwtPayload = { userId: user.id, name: user.name, email: user.email };
      const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      res.status(201).json({ token: authToken, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Google signup error:', error.message);
      res.status(401).json({ message: 'Invalid Google token' });
    }
  };
  