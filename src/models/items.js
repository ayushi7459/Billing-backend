import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    image: {
        type: String,
        required: [true, "Image URL is required"]
    },
    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        unique : true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required: [true, "Category is required"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required: [true, "user is required"]
    },
    sellPrice: {
        type: Number,
        required: [true, "Sell price is required"]
    },
    sellPriceUnit: {
        type: String,
        required: [true, "Sell price unit is required"]
    },
    mrp: {
        type: Number,
        required: [true, "MRP is required"]
    },
    purchasePrice: {
        type: Number,
        required: [false, "Purchase price is required"]
    }
},{timestamps:true});

export const itemModel = mongoose.model('Items', itemSchema);