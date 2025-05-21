import express from "express";
import { googleLogin,googleSignup } from '../controller/User.js';
import {register, login} from '../controller/User.js';
const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/google-login', googleLogin);
router.post('/google-register', googleSignup);
export default router;