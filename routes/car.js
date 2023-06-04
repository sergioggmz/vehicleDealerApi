import express from "express";
import Car from '../models/car.js';
import {Company} from '../models/company.js';
import {check,validationResult} from 'express-validator';
import authorize from "../middlewares/role.js";
import auth from "../middlewares/auth.js";
import Role from '../helpers/role.js';

const router = express.Router();

router.get('/',[auth, authorize([Role.Admin])], async (req,res) => {
    const cars = await Car
        .find()
    res.send(cars);
});

router.get('/:id', async (req,res) => {
    const car = await Car.findById(req.params.id);
    if(!car) {
        return res.status(404).send('Car not found by these id')
    }
    res.status(200).send(car);
});
// POST data model normalized
// router.post('/',[
//   check('company').isMongoId(),
//   check('model').isLength({min: 3})
// ], async (req,res) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty()) {
//         return res.status(422).json({errors: errors.array()})
//     }
//     const car = new Car( {
//         company: req.body.company,
//         model: req.body.model,
//         year: req.body.year,
//         sold: req.body.sold,
//         price: req.body.price,
//         extras: req.body.extras
//     })
//
//     const result = await car.save();
//     res.status(201).send(result);
// });
// POST data model embedded
router.post('/', async (req,res) => {

    const company = await Company.findById(req.body.company);
    if(!company) {
        return res.status(404).send('Company not found by these id')
    }
    const car = new Car( {
        company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    })

    const result = await car.save();
    res.status(201).send(result);
});

router.put('/:id',[
    check('company').isLength({min: 3}),
    check('model').isLength({min: 3})
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()})
    }
    const car = await Car.findByIdAndUpdate(req.params.id, {
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
    }, {new: true})

    if(!car) {
        return res.status(404).send('Car not found by these id')
    }
    res.status(204).send(car);
});

router.delete('/:id',async (req,res) => {
    const car = await Car.findByIdAndDelete(req.params.id);
    if(!car) {
        return res.status(404).send('Car not found by these id, it can`t delete')
    }
    return res.status(200).send('car deleted');
});

export default router



