import { Category } from '../models/category.model.js'

export const createCategory = async (req, res) => {
    try {
        const { name, description, slug } = req.body;

        if (!name || !description || !slug) {
            return res.status(400).json({ success: false, message: "Name , slug and description are required" });
        }

        const category = await Category.create(req.body);

        res.status(201).json({
            data: category,
            success: true,
            message: "Category added successfully"
        });
    } catch (err) {
        console.error("Error creating category:", err);
        return res.status(500).json({ success: false, message: "Failed to create category, please try again later." });
    }
};

export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        if (!categories.length) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        res.json({ data: categories, success: true, message: "category fetched successfully" });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ success: false, message: "Failed to fetch categories, please try again later." });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ data: category, success: true, message: "category fetch by id successfully" });
    } catch (err) {
        console.error("Error fetching category by ID:", err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid category ID format" });
        }
        res.status(500).json({ success: false, message: "Failed to fetch category, please try again later." });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { name, description, slug } = req.body;
        console.log('req.body', req.body);
        console.log('req.params.id', req.params.id);
        

        if (!name || !description || !slug) {
            return res.status(400).json({ success: false, message: "Name, slug and description are required" });
        }

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const categoryUpdate = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, slug },
            { new: true, runValidators: true }
        );

        res.json({
            data: categoryUpdate,
            success: true,
            message: "Category updated successfully"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update category, please try again later." });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        res.json({ success: true, message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid category ID format" });
        }
        res.status(500).json({ success: false, message: "Failed to delete category, please try again later." });
    }
};


