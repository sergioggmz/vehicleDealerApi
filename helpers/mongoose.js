import mongoose from "mongoose";
// mongoose connection
const mongooseConnection = async () => {
   return await mongoose.connect(`${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`);
}

export default mongooseConnection
