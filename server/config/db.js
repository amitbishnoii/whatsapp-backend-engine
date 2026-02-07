import mongoose from "mongoose";

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongodb connected!');
    } catch (error) {
        console.log('error occured: ', error);
        process.exit(1);
    }
};

export default connection;