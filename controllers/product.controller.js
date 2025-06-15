import { Product } from '../models/product.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';


export const getProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchInput = req.query.searchInput?.trim() || "";

        const baseAggregation = [
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            { $unwind: "$subCategoryDetails" },
            {
                $match: {
                    $or: [
                        { title: { $regex: searchInput, $options: "i" } },
                        { description: { $regex: searchInput, $options: "i" } },
                        { "categoryDetails.name": { $regex: searchInput, $options: "i" } },
                        { "subCategoryDetails.name": { $regex: searchInput, $options: "i" } }
                    ]
                }
            }
        ];

        const countResult = await Product.aggregate([
            ...baseAggregation,
            { $count: "total" }
        ]);

        const totalProducts = countResult[0]?.total || 0;

        const products = await Product.aggregate([
            ...baseAggregation,
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                    rating: 1,
                    category: "$categoryDetails",
                    subCategory: "$subCategoryDetails"
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        return res.status(200).json({
            data: products,
            success: true,
            message: "Products fetched successfully",
            pagination: {
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                pageSize: limit
            }
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the products"
        });
    }
};

export const getProductByCategory = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalProducts = await Product.countDocuments({ category: id });

        if (totalProducts === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the provided category"
            });
        }

        const products = await Product.find({ category: id })
            .populate('category').select("-subCategory")
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            data: products,
            success: true,
            message: `Products fetched successfully for category ${id}`,
            pagination: {
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                pageSize: limit
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching products by category"
        });
    }
};

export const addProduct = async (req, res) => {
    const { title, description, price, rating, category, subCategory } = req.body;

    try {
        if (!title || !description || !price || !rating || !category || !subCategory) {
            return res.status(400).json({
                success: false,
                message: "Invalid field(s). All fields except image are required."
            });
        }

        // if (!req.file ) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Image file is required."
        //     });
        // }
        // const result = await uploadToCloudinary(req.file.buffer);


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image file is required."
            });
        }

        // for multiple select image
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map(result => result.secure_url);

        const newProduct = await Product.create({
            title,
            description,
            // image: result.secure_url,
            image: imageUrls,
            price,
            rating,
            category,
            subCategory
        });

        res.status(201).json({
            data: newProduct,
            success: true,
            message: "Product added successfully"
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the product"
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            data: deletedProduct,
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the product"
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, rating, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { title, description, image, price, rating, category },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            data: updatedProduct,
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the product"
        });
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id.trim());
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "No product found with the provided ID"
            });
        }
        return res.status(200).json({
            data: product,
            success: true,
            message: "ProductByID fetch successfully"
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the productById"
        });
    }
};


