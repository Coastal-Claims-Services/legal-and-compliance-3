import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        console.log("**********");        
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/coastal-claims-portal';
        
        await mongoose.connect(mongoURI);
        
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB; 