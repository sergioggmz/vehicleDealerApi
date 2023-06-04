import express from "express";
import mongoose from "mongoose";
import Sale from '../models/sale.js';
import Car from '../models/car.js';
import User from '../models/user.js';

const router = express.Router();
router.get('/', async (req,res) => {
    const sales = await Sale.find();
    res.send(sales);
});

router.get('/:id', async (req,res) => {
    const sale = await Sale.findById(req.params.id);
    if(!sale) {
        return res.status(404).send('Sale not found by these id')
    }
    res.status(200).send(sale);
});

router.post('/', async (req,res) => {
    const user = await User.findById(req.body.user);
    const car = await Car.findById(req.body.car);
    if(!user) {
        return res.status(404).send('User not found by these id');
    }
    if(!car) {
        return res.status(404).send('Car not found by these id');
    }
    if(car.sold) {
        return res.status(400).send('These car was sold, it can not sold')
    }
    const sale = new Sale({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        car: {
            _id: car._id,
            model: car.model
        },
        price: req.body.price
    })

    const session = await mongoose.startSession();
   session.startTransaction();
    try {
        const result = await sale.save();
        user.isCustomer = true;
        user.save();
        car.sold = true;
        car.save();
        await session.commitTransaction();
        session.endSession();
        res.status(201).send(result);
    }catch (e) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send(e.message);
    }
});

export default router



