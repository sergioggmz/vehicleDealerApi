import express from "express";
const router = express.Router();
import {Company} from "../models/company.js";

router.get('/', async (req,res) => {
    const companies = await Company.find();
    res.send(companies);
});

router.get('/:id', async (req,res) => {
    const company = await Company.findById(req.params.id);
    if(!company) {
        return res.status(404).send('Company not found by these id')
    }
    res.status(200).send(company);
});

router.post('/', async (req,res) => {
    const company = new Company({
        name: req.body.name,
        country: req.body.country
    })

    const result = await company.save();
    res.status(201).send(result);
});

router.put('/:id', async (req,res) => {

    const company = await Company.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        country: req.body.country
    }, {new: true})

    if(!company) {
        return res.status(404).send('Company not found by these id')
    }
    res.status(204).send(company);
});

router.delete('/:id',async (req,res) => {
    const company = await Company.findByIdAndDelete(req.params.id);
    if(!company) {
        return res.status(404).send('Company not found by these id, it can`t delete')
    }
    return res.status(200).send('Company deleted');
})

export default router



