import { Request, Response } from "express";
import { OkPacket } from "mysql2";  // Import OkPacket for correct type on insert query
import db from "../../config/db";
// Interface for a product variation
interface ProductVariation {
  size_id: number;
  color: string;
  quantity: number;
}

// Interface for the product request
interface ProductRequest {
  title: string;
  description: string;
  price: number;
  discount?: number;
  category_id: number;
  subcategory_id?: number;
  main_image: string;
  is_archived?: boolean;
  variations: ProductVariation[];
}

export const addProduct = (req: Request, res: Response): any => {
  const { title, description, price, discount, category_id, subcategory_id, main_image, is_archived, variations }: ProductRequest = req.body;

  // Basic validation (you can extend this further)
//   if (!title || !price || !main_image || !category_id || !variations || !Array.isArray(variations)) {
//     return res.status(400).json({ message: "Missing required fields or invalid variations format." });
//   }

  // Insert product into 'products' table
  const productQuery = `
    INSERT INTO products (title, description, price, discount, category_id, subcategory_id, main_image, is_archived)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const productValues = [title, description, price, discount || 0, category_id, subcategory_id || null, main_image, is_archived || false];

  db.query(productQuery, productValues, (err: any, result: OkPacket) => {
    if (err) {
      return res.status(500).json({ message: "Failed to add product", error: err });
    }

    // Cast result to OkPacket to access insertId
    const insertResult = result as OkPacket;
    const productId = insertResult.insertId;

    // Insert product variations into 'product_variations' table
    const variationQuery = `
      INSERT INTO product_variations (product_id, size_id, color, quantity)
      VALUES ?
    `;

    // Map through the variations array and create values for the SQL query
    const variationValues = variations.map((variation: ProductVariation) => [
      productId, 
      variation.size_id, 
      variation.color, 
      variation.quantity
    ]);

    db.query(variationQuery, [variationValues], (variationErr: any) => {
      if (variationErr) {
        return res.status(500).json({ message: "Failed to add product variations", error: variationErr });
      }
      return res.status(201).json({ message: "Product and variations added successfully", productId });
    });
  });
};
