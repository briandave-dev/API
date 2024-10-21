import { Request, Response } from "express";
import { OkPacket } from "mysql2"; // Import OkPacket for correct type on insert query
import db from "../../config/db";

// Interface for a product variation
interface ProductVariation {
  size_id: number;
  color: string;
  quantity: number;
}

// Interface for product images
interface ProductImage {
  url: string;
}

// Interface for the product request
interface ProductRequest {
  title: string;
  description: string;
  price: number;
  discount?: number;
  hashtag_id: number;
  category_id: number;
  subcategory_id?: number;
  main_image: string;
  is_archived?: boolean;
  variations: ProductVariation[];
  images?: ProductImage[]; // Make images optional
}

export const addProduct = (req: Request, res: Response): any => {
  const { title, description, price, discount, hashtag_id, category_id, subcategory_id, main_image, is_archived, variations, images }: ProductRequest = req.body;

  // Start a transaction using the connection pool
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get database connection", error: err });
    }

    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        return res.status(500).json({ message: "Failed to start transaction", error: transactionErr });
      }

      // Insert product into 'products' table
      const productQuery = `
        INSERT INTO products (title, description, price, discount, hashtag_id, category_id, subcategory_id, main_image, is_archived)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const productValues = [title, description, price, discount || 0, hashtag_id, category_id, subcategory_id || null, main_image, is_archived || false];

      connection.query(productQuery, productValues, (err: any, result: OkPacket) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ message: "Failed to add product", error: err });
          });
        }

        // Cast result to OkPacket to access insertId
        const insertResult = result as OkPacket;
        const productId = insertResult.insertId;

        // Insert product variations into 'product_variations' table
        const variationQuery = `
          INSERT INTO product_variations (product_id, size_id, color, quantity)
          VALUES ?
        `;

        const variationValues = variations.map((variation: ProductVariation) => [
          productId, 
          variation.size_id, 
          variation.color, 
          variation.quantity
        ]);

        connection.query(variationQuery, [variationValues], (variationErr: any) => {
          if (variationErr) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ message: "Failed to add product variations", error: variationErr });
            });
          }

          // Check if there are images to insert
          if (images && images.length > 0) {
            const imageQuery = `
              INSERT INTO product_images (product_id, url)
              VALUES ?
            `;

            const imageValues = images.map((image: ProductImage) => [
              productId, 
              image.url
            ]);

            connection.query(imageQuery, [imageValues], (imageErr: any) => {
              if (imageErr) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ message: "Failed to add product images", error: imageErr });
                });
              }

              // Commit the transaction if everything is successful
              connection.commit((commitErr) => {
                if (commitErr) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ message: "Failed to commit transaction", error: commitErr });
                  });
                }

                connection.release();
                return res.status(201).json({ message: "Product and variations added successfully", productId });
              });
            });
          } else {
            // No images provided; just commit the transaction
            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ message: "Failed to commit transaction", error: commitErr });
                });
              }

              connection.release();
              return res.status(201).json({ message: "Product and variations added successfully without images", productId });
            });
          }
        });
      });
    });
  });
};
