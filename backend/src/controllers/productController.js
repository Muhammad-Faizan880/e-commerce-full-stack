import Product from "../models/Product.js";

/**
 * GET /api/products
 * Fetch all products with optional category, search, and sorting filters
 */
export const getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== "all") {
      query.category = category.toLowerCase().trim();
    }

    // Search by Name or Description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "featured") {
      sortOption = { reviewsCount: -1 };
    }

    const products = await Product.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(" [GET PRODUCTS ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * GET /api/products/:id
 * Fetch single product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(" [GET PRODUCT BY ID ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};

/**
 * POST /api/products (Admin Only)
 * Create a new product
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      subtitle,
      category,
      categoryLabel,
      price,
      compareAtPrice,
      rating,
      badge,
      image,
      gallery,
      description,
      material,
      dimensions,
      colors,
      stock,
    } = req.body;

    if (!name || !category || !price || !image || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, category, price, image, and description are required",
      });
    }

    const product = await Product.create({
      name,
      subtitle,
      category,
      categoryLabel: categoryLabel || `${category.charAt(0).toUpperCase() + category.slice(1)} Living`,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      rating: rating ? Number(rating) : 5.0,
      badge: badge || null,
      image,
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [image],
      description,
      material,
      dimensions,
      colors: colors || [],
      stock: stock !== undefined ? Number(stock) : 10,
      inStock: Number(stock || 10) > 0,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(" [CREATE PRODUCT ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * PUT /api/products/:id (Admin Only)
 * Update existing product
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update fields
    const updates = req.body;
    if (updates.stock !== undefined) {
      updates.inStock = Number(updates.stock) > 0;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(" [UPDATE PRODUCT ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/products/:id (Admin Only)
 * Delete product from catalog
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from catalog",
    });
  } catch (error) {
    console.error(" [DELETE PRODUCT ERROR]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
