import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import {check,validationResult} from "express-validator";

const router = express.Router();

router.post('/login',[
    check('email').isLength({min: 3}),
    check('password').not().isEmpty().withMessage('Password field should not be empty'),
    check('password').isLength({min: 3}).withMessage('Password field require min three characters')
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    let user= await User.findOne({email: req.body.email});
    if(!user) {
        return res.status(400).send('Incorrect user or password');
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) {
        return res.status(400).send('Incorrect password')
    }
    const jwtToken = user.generateJWT();
    res.status(201).header('Authorization',jwtToken).send({_id:user._id,name: user.name, email:user.email});
});

export default router