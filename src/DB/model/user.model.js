import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: [18, 'Age must be at least 18'],
        max: 60
    },
    phone: {
        type: String,
        required: true

    }
}, {
    strict: true,
    strictQuery: true,
    validateBeforeSave: true,  
    timestamps: false
})

export const userModel =mongoose.models.User || mongoose.model('User', userSchema);