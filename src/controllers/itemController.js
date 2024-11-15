import { itemModel } from "../models/items.js";
import { upload } from "../middlewares/cloudinary.js";  

//create items
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
                userId: req.user._id,  // Associate item with the logged-in user
                mrp,
                purchasePrice
            });

            await newItem.save();
            res.status(201).json({ message: 'Item created successfully', item: newItem });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

// Get a list of items for the current user
export const getlist = async (req, res) => {
    try {
        // Retrieve only items belonging to the logged-in user
        const items = await itemModel.find({ userId: req.user._id });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get an item by ID for the current user
export const getById = async (req, res) => {
    try {
        // Find the item by ID and ensure it belongs to the logged-in user
        const item = await itemModel.findOne({ _id: req.params.id, userId: req.user._id });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an item by ID for the current user
export const update = async (req, res) => {
    try {
        // Update only if the item belongs to the logged-in user
        const updatedItem = await itemModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item by ID for the current user
export const deletebyId = async (req, res) => {
    try {
        // Delete only if the item belongs to the logged-in user
        const deletedItem = await itemModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find products by category for the logged-in user
        const products = await itemModel.find({
            category: categoryId,
            userId: req.user._id  // Ensures only products of the current user are fetched
        });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

