import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 99
    },
    country: String,
    date: {type: Date, default: Date.now}
});

const Company = mongoose.model('company',companySchema);

export {Company,companySchema};