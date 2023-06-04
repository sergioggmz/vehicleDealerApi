import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isCustomer: Boolean,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {type: Date, default: Date.now}
});
userSchema.methods.generateJWT = function() {
    return jwt.sign({_id: this._id,name: this.name},process.env.SECRET_KEY_JWT)
}
const User = mongoose.model('user',userSchema);
export default User;