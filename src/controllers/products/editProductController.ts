// import { Request, Response } from "express";
// import { OkPacket } from "mysql2";
// import db from "../../config/db";

// // Reuse the interfaces for product variations and images
// interface ProductVariation {
//   size_id: number;
//   color: string;
//   quantity: number;
// }

// interface ProductImage {
//   url: string;
// }

// interface ProductRequest {
//   title: string;
//   description: string;
//   price: number;
//   discount?: number;
//   hashtag_id: number;
//   category_id: number;
//   subcategory_id?: number;
//   main_image: string;
//   is_archived?: boolean;
//   variations: ProductVariation[];
//   images?: ProductImage[];
// }

// export const editProduct = (req: Request, res: Response): any => {
//   const productId = Number(req.query.id);
//   const { title, description, price, discount, hashtag_id, category_id, subcategory_id, main_image, is_archived, variations, images }: ProductRequest = req.body;

//   db.getConnection((err, connection) => {
//     if (err) {
//       return res.status(500).json({ message: "Failed to get database connection", error: err });
//     }

//     connection.beginTransaction((transactionErr) => {
//       if (transactionErr) {
//         connection.release();
//         return res.status(500).json({ message: "Failed to start transaction", error: transactionErr });
//       }

//       // Update product in 'products' table
//       const productQuery = `
//         UPDATE products
//         SET title = ?, description = ?, price = ?, discount = ?, hashtag_id = ?, category_id = ?, subcategory_id = ?, main_image = ?, is_archived = ?
//         WHERE id = ?
//       `;

//       const productValues = [title, description, price, discount || 0, hashtag_id, category_id, subcategory_id || null, main_image, is_archived || false, productId];

//       connection.query(productQuery, productValues, (err: any) => {
//         if (err) {
//           return connection.rollback(() => {
//             connection.release();
//             res.status(500).json({ message: "Failed to update product", error: err });
//           });
//         }

//         // Delete existing variations for the product
//         const deleteVariationsQuery = `DELETE FROM product_variations WHERE product_id = ?`;
//         connection.query(deleteVariationsQuery, [productId], (deleteErr: any) => {
//           if (deleteErr) {
//             return connection.rollback(() => {
//               connection.release();
//               res.status(500).json({ message: "Failed to delete existing product variations", error: deleteErr });
//             });
//           }

//           // Insert new product variations
//           const variationQuery = `
//             INSERT INTO product_variations (product_id, size_id, color, quantity)
//             VALUES ?
//           `;

//           const variationValues = variations.map((variation: ProductVariation) => [
//             productId,
//             variation.size_id,
//             variation.color,
//             variation.quantity
//           ]);

//           connection.query(variationQuery, [variationValues], (variationErr: any) => {
//             if (variationErr) {
//               return connection.rollback(() => {
//                 connection.release();
//                 res.status(500).json({ message: "Failed to update product variations", error: variationErr });
//               });
//             }

//             // Delete existing images for the product
//             const deleteImagesQuery = `DELETE FROM product_images WHERE product_id = ?`;
//             connection.query(deleteImagesQuery, [productId], (deleteImageErr: any) => {
//               if (deleteImageErr) {
//                 return connection.rollback(() => {
//                   connection.release();
//                   res.status(500).json({ message: "Failed to delete existing product images", error: deleteImageErr });
//                 });
//               }

//               // Check if there are images to insert
//               if (images && images.length > 0) {
//                 const imageQuery = `
//                   INSERT INTO product_images (product_id, url)
//                   VALUES ?
//                 `;

//                 const imageValues = images.map((image: ProductImage) => [
//                   productId,
//                   image.url
//                 ]);

//                 connection.query(imageQuery, [imageValues], (imageErr: any) => {
//                   if (imageErr) {
//                     return connection.rollback(() => {
//                       connection.release();
//                       res.status(500).json({ message: "Failed to update product images", error: imageErr });
//                     });
//                   }

//                   // Commit the transaction if everything is successful
//                   connection.commit((commitErr) => {
//                     if (commitErr) {
//                       return connection.rollback(() => {
//                         connection.release();
//                         res.status(500).json({ message: "Failed to commit transaction", error: commitErr });
//                       });
//                     }

//                     connection.release();
//                     return res.status(200).json({ message: "Product updated successfully", productId });
//                   });
//                 });
//               } else {
//                 // No images provided; just commit the transaction
//                 connection.commit((commitErr) => {
//                   if (commitErr) {
//                     return connection.rollback(() => {
//                       connection.release();
//                       res.status(500).json({ message: "Failed to commit transaction", error: commitErr });
//                     });
//                   }

//                   connection.release();
//                   return res.status(200).json({ message: "Product updated successfully without images", productId });
//                 });
//               }
//             });
//           });
//         });
//       });
//     });
//   });
// };

import { Request, Response } from "express";
import { OkPacket } from "mysql2";
import db from "../../config/db";

// Reuse the interfaces for product variations and images
interface ProductVariation {
  size_id: number;
  color: string;
  quantity: number;
}

interface ProductImage {
  url: string;
}

interface ProductRequest {
    productId: number;
  title: string;
  description: string;
  price: number;
  discount?: number;
  hashtag_id: number;
  category_id: number;
  subcategory_id?: number | null;
  main_image: string;
  is_archived?: boolean;
  variations: ProductVariation[];
  images?: ProductImage[];
}

export const editProduct = (req: Request, res: Response): any => {
  const productId = Number(req.params.id);
  const {
    title,
    description,
    price,
    discount = 0,  // Default value for discount if not provided
    hashtag_id,
    category_id,
    subcategory_id = null, // Default null for optional subcategory
    main_image,
    is_archived = false,  // Default value for is_archived
    variations,
    images = []  // Default empty array for images if not provided
  }: ProductRequest = req.body;

  // Parse the numeric values to ensure correct types
  const parsedPrice = Number(price);
  const parsedDiscount = Number(discount);
  const parsedCategoryId = Number(category_id);
  const parsedSubcategoryId = subcategory_id ? Number(subcategory_id) : null;
  const parsedHashtagId = Number(hashtag_id);

  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get database connection", error: err });
    }

    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        return res.status(500).json({ message: "Failed to start transaction", error: transactionErr });
      }

      // Update product in 'products' table
      const productQuery = `
        UPDATE products
        SET title = ?, description = ?, price = ?, discount = ?, hashtag_id = ?, category_id = ?, subcategory_id = ?, main_image = ?, is_archived = ?
        WHERE id = ?
      `;

      const productValues = [
        title,
        description,
        parsedPrice,
        parsedDiscount,
        parsedHashtagId,
        parsedCategoryId,
        parsedSubcategoryId,
        main_image,
        is_archived,
        productId
      ];

      connection.query(productQuery, productValues, (err: any) => {
        if (err) {
          console.error("Error updating product:", err);
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ message: "Failed to update product", error: err });
          });
        }

        // Delete existing variations for the product
        const deleteVariationsQuery = `DELETE FROM product_variations WHERE product_id = ?`;
        connection.query(deleteVariationsQuery, [productId], (deleteErr: any) => {
          if (deleteErr) {
            console.error("Error deleting product variations:", deleteErr);
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ message: "Failed to delete existing product variations", error: deleteErr });
            });
          }

          // Insert new product variations
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
              console.error("Error inserting product variations:", variationErr);
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ message: "Failed to update product variations", error: variationErr });
              });
            }

            // Delete existing images for the product
            const deleteImagesQuery = `DELETE FROM product_images WHERE product_id = ?`;
            connection.query(deleteImagesQuery, [productId], (deleteImageErr: any) => {
              if (deleteImageErr) {
                console.error("Error deleting product images:", deleteImageErr);
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ message: "Failed to delete existing product images", error: deleteImageErr });
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
                    console.error("Error inserting product images:", imageErr);
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ message: "Failed to update product images", error: imageErr });
                    });
                  }

                  // Commit the transaction if everything is successful
                  connection.commit((commitErr) => {
                    if (commitErr) {
                      console.error("Error committing transaction:", commitErr);
                      return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: "Failed to commit transaction", error: commitErr });
                      });
                    }

                    connection.release();
                    return res.status(200).json({ message: "Product updated successfully", productId });
                  });
                });
              } else {
                // No images provided; just commit the transaction
                connection.commit((commitErr) => {
                  if (commitErr) {
                    console.error("Error committing transaction:", commitErr);
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ message: "Failed to commit transaction", error: commitErr });
                    });
                  }

                  connection.release();
                  return res.status(200).json({ message: "Product updated successfully without images", productId });
                });
              }
            });
          });
        });
      });
    });
  });
};
