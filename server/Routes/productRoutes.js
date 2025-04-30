import express from "express";
import Product from "../Models/ProductSchema.js";
import { admin, protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// post // create the product
router.post("/create", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json({ createdProduct });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// put // update the product

router.put("/update/:id", protect, admin, async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    category,
    brand,
    sizes,
    colors,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
    sku,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (err) {
    res.status(501).json(err, { message: "Server Error" });
  }
});

router.delete("/remove/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.status(200).json({
        message: `Product with Id ${req.params.id} has been successfully deleted.`,
      });
    } else {
      res
        .status(401)
        .json({ message: "Product Not Found or already deleted." });
    }
  } catch (err) {
    res.status(501).json(err, { message: "Server Error" });
  }
});

// get all products

router.get("/all-products", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;
    let query = {};

    // Filter Logic
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    let sort;
    if (sortBy) {
      switch (sortBy) {
        case "PriceAsc":
          sort = { price: 1 };
          break;
        case "PriceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (err) {
    res.status(501).json(err, { message: "Server Error" });
  }
});

// get best seller products
router.get("/best-sellers", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (!bestSeller) {
      return res
        .status(404)
        .json({ message: "Not Any Best Seller Product Available Now." });
    } else {
      return res.status(200).json(bestSeller);
    }
  } catch (err) {
    res.status(501).json({ message: "Server Error." });
  }
});

// get New Arrivals Products
router.get("/new-arrivals", async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 }).limit(8);
    if (!product) {
      res
        .status(404)
        .json({ message: "Not Any Best Seller Product Available Now." });
    } else {
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(501).json(err, { message: "Server Error." });
  }
});

// get similar products based on current product's gender & category

router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product Not Found." });
    }
    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    res.status(200).json(similarProducts);
  } catch (err) {
    res.status(501).json(err, { message: "Server Error." });
  }
});

// get Single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product Not Found." });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(501).json(err, { message: "Server Error." });
  }
});

export default router;
