import { SubCategory } from '../models/subCategory.model.js'

export const createSubCategory = async (req, res) => {
    try {
        const { name, description, slug, category } = req.body;

        if (!name || !description || !slug || !category) {
            return res.status(400).json({ success: false, message: "Name , slug and description are required" });
        }

        const categorys = await SubCategory.create(req.body);

        res.status(201).json({
            data: categorys,
            success: true,
            message: "Category added successfully"
        });
    } catch (err) {
        console.error("Error creating category:", err);
        return res.status(500).json({ success: false, message: "Failed to create category, please try again later." });
    }
};

export const getSubCategory = async (req, res) => {
    try {
        const categories = await SubCategory.find().sort({ createdAt: -1 }).populate('category')
        if (!categories.length) {
            return res.status(404).json({ success: false, message: "No categories found" });
        }
        res.json({ data: categories, success: true, message: "category fetched successfully" });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ success: false, message: "Failed to fetch categories, please try again later." });
    }
};

export const getSubCategoryById = async (req, res) => {
    try {
        const category = await SubCategory.findById(req.params.id).populate('category');

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.json({ data: category, success: true, message: "category fetch by id successfully" });
    } catch (err) {
        console.error("Error fetching category by ID:", err);
        res.status(500).json({ success: false, message: "Failed to fetch category, please try again later." });
    }
};

export const updateSubCategory = async (req, res) => {
    try {
        const { name, description, slug, category } = req.body;
        console.log('req.body', req.body);
        console.log('req.params.id', req.params.id);

        if (!name || !description || !slug || !category) {
            return res.status(400).json({ success: false, message: "Name, slug, category and description are required" });
        }

        const categorys = await SubCategory.findById(req.params.id);
        if (!categorys) {
            return res.status(404).json({ success: false, message: "Category not found" });
        } 

        const categoryUpdate = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { name, description, slug, category },
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

export const deleteSubCategory = async (req, res) => {
    try {
        const category = await SubCategory.findByIdAndDelete(req.params.id);

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


