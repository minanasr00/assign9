import mongoose from "mongoose";


const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (v) { 
                if (v === v.toUpperCase()){ 
                    return v.toLowerCase();
                }
            }
        }
    },
    content: {

        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
}, {
    strict: true,
    strictQuery: true,
    timestamps:true,
    validateBeforeSave: true,  
    toJSON:{ virtuals:true },
    toObject:{ virtuals:true }
})

export const noteModel = mongoose.models.Note || mongoose.model('Note', notesSchema);
