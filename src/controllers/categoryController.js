import { categoryModel } from '../models/categories.js';

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const newCategory = new categoryModel({
            name,
            description,
            userId: req.user._id 
        });
        
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all categories for the current user
export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({ userId: req.user._id });
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single category by ID for the current user
export const getCategoryById = async (req, res) => {
    try {
       
        const category = await categoryModel.findOne({ _id: req.params.id, userId: req.user._id });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category by ID for the current user
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

       
        const updatedCategory = await categoryModel.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a category by ID for the current user
export const deleteCategory = async (req, res) => {
    try {
        
        const deletedCategory = await categoryModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
