import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import {check,validationResult} from "express-validator";

const router = express.Router();

router.get('/', async (req,res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/:id', async (req,res) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).send('User not found by these id')
    }
    res.status(200).send(user);
});

router.post('/',[
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3}),
    check('password').not().isEmpty().withMessage('Password field should not be empty'),
    check('password').isLength({min: 3}).withMessage('Password field require min three characters')
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    let user= await User.findOne({email: req.body.email});
    if(user) {
        return res.status(400).send('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    user = new User( {
        name: req.body.name,
        isCustomer: false,
        email: req.body.email,
        password: hashPassword
    })

    await user.save();
    const jwtToken = user.generateJWT();
    res.status(201).header('Authorization',jwtToken).send({_id:user._id,name: user.name, email:user.email});
});

router.put('/:id',[
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isCustomer: req.body.isCustomer,
        email: req.body.email
    }, {new: true})

    if(!user) {
        return res.status(404).send('User not found by these id')
    }
    res.status(204).send(user);
});

router.delete('/:id',async (req,res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        return res.status(404).send('User not found by these id, it can`t delete')
    }
    return res.status(200).send('User deleted');
})

export default router



