import { itemModel } from "../models/items.js";
import { upload } from "../middlewares/cloudinary.js";  


// Create a new item with an uploaded image
export const create = [
    upload.single('image'),  // Middleware to handle image upload
    async (req, res) => {
        try {
            const { productName, sellPrice, sellPriceUnit, category, mrp, purchasePrice } = req.body;
            
            // Check if an image was uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'Image is required' });
            }

            const newItem = new itemModel({
                image: req.file.path,  // Cloudinary URL
                productName,
                sellPrice,
                sellPriceUnit,
                category,
                mrp,
                purchasePrice
            });
            // console.log(req.file.path )
            // console.log(newItem);

            await newItem.save();
            res.status(201).json({ message: 'Item created successfully', item: newItem });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];



// list of item
export const getlist = async (req, res) => {
    try {
        const items = await itemModel.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an item by ID
export const getById = async (req, res) => {
    try {
        const item = await itemModel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an item by ID
export const update = async (req, res) => {
    try {
        const updatedItem = await itemModel.findByIdAndUpdate(req.params.id, req.body,
             { new: true, runValidators: true }); // return the updated user
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item by ID
export const deletebyId = async (req, res) => {
    try {
        const deletedItem = await itemModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};