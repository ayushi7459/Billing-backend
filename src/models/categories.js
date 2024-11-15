import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: [true, "user is required"]
    }
}, { timestamps: true });

export const categoryModel = mongoose.model('Category', categorySchema);
