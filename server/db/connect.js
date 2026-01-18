import mongoose from 'mongoose';

const connect = async (url) => {
    try {
        if (!url) {
            throw new Error("MongoUrl is not defined in env file")
        }
        await mongoose.connect(url);
        console.log('MongoDB successfully connected.');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Exit process with failure
        process.exit(1);
    }


}

export default connect;