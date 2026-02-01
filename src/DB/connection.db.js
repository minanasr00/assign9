import mongoose from "mongoose";
import { DB_uri } from './../../config/config.service.js';

export const connectDB = async () => { 
    try {
        const result = await mongoose.connect(DB_uri,
            {
                serverSelectionTimeoutMS: 5000, 
                socketTimeoutMS: 45000,
            });
        console.log('Database connected successfully');
        console.log(result.models);    
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

