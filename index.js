import express from 'express';
import mongoose from 'mongoose';
import carRoute from './routes/car.js';
import userRoute from './routes/user.js';
import companyRoute from './routes/company.js';
import sale from './routes/sale.js';
import auth from './routes/auth.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3003;

// middlewares
app.use(express.json());
app.use('/api/cars',carRoute);
app.use('/api/users',userRoute);
app.use('/api/company',companyRoute);
app.use('/api/sale',sale);
app.use('/api/auth',auth);

app.listen(port, () => console.log(`listen on port ${port}`))

mongoose.connect('mongodb://127.0.0.1/carsdb')
        .then(() => console.log('connected to mongoDB'))
        .catch(() => console.log('Error connecting to mongoDB'))