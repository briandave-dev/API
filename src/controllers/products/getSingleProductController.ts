// import { Request, Response } from "express";
// import db from "../../config/db";

// export const getProduct = (req: Request, res: Response): any => {
//   const productId = req.params.id;

//   if (!productId) {
//     return res.status(500).json({ message: "No product id provided" });
//   }

//   // Start by getting the product details, including category and subcategory
//   const productQuery = `
//     SELECT p.id, p.title, p.description, p.price, p.discount, p.hashtag_id, 
//            p.category_id, categories.name AS category_name,
//            p.subcategory_id, subcategories.name AS subcategory_name,
//            p.main_image, p.is_archived
//     FROM products p
//     JOIN categories ON categories.id = p.category_id
//     LEFT JOIN subcategories ON subcategories.id = p.subcategory_id
//     WHERE p.id = ?
//   `;

//   db.query(productQuery, [productId], (err, productResults: any) => {
//     if (err) {
//       return res.status(500).json({ message: "Failed to retrieve product details", error: err });
//     }

//     if (productResults.length === 0) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const product = productResults[0]; // There will be only one product result

//     // Structure categories and subcategories as arrays
//     product.categories = [{
//       id: product.category_id,
//       name: product.category_name,
//     }];

//     product.subcategories = product.subcategory_id ? [{
//       id: product.subcategory_id,
//       name: product.subcategory_name,
//     }] : [];

//     // Remove category_id and subcategory_id from the product result
//     delete product.category_id;
//     delete product.category_name;
//     delete product.subcategory_id;
//     delete product.subcategory_name;

//     // Fetch product variations and join with sizes to get size name
//     const variationQuery = `
//       SELECT pv.size_id, sizes.name AS size_name, pv.color, pv.quantity
//       FROM product_variations pv
//       LEFT JOIN sizes ON sizes.id = pv.size_id
//       WHERE pv.product_id = ?
//     `;

//     db.query(variationQuery, [productId], (variationErr, variationResults: any) => {
//       if (variationErr) {
//         return res.status(500).json({ message: "Failed to retrieve product variations", error: variationErr });
//       }

//       // Add variations with sizes to the product object
//       product.variations = variationResults.map((variation: any) => ({
//         sizes: [{
//           id: variation.size_id,
//           name: variation.size_name,
//         }],
//         color: variation.color,
//         quantity: variation.quantity,
//       }));

//       // Fetch product images
//       const imageQuery = `
//         SELECT pi.url
//         FROM product_images pi
//         WHERE pi.product_id = ?
//       `;

//       db.query(imageQuery, [productId], (imageErr, imageResults) => {
//         if (imageErr) {
//           return res.status(500).json({ message: "Failed to retrieve product images", error: imageErr });
//         }

//         product.images = imageResults; // Add images to the product object

//         // Return the product with all associated details
//         return res.status(200).json(product);
//       });
//     });
//   });
// };


import { Request, Response } from "express";
import db from "../../config/db";

export const getProduct = (req: Request, res: Response): any => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(500).json({ message: "No product id provided" });
  }

  // Start by getting the product details, including category and subcategory
  const productQuery = `
    SELECT p.id, p.title, p.description, p.price, p.discount, 
           p.category_id, categories.name AS category_name,
           p.subcategory_id, subcategories.name AS subcategory_name,
           p.main_image, p.is_archived, p.hashtag_id, hashtags.name AS hashtag_name
    FROM products p
    JOIN categories ON categories.id = p.category_id
    LEFT JOIN subcategories ON subcategories.id = p.subcategory_id
    LEFT JOIN hashtags ON hashtags.id = p.hashtag_id
    WHERE p.id = ?
  `;

  db.query(productQuery, [productId], (err, productResults: any) => {
    if (err) {
      return res.status(500).json({ message: "Failed to retrieve product details", error: err });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResults[0]; // There will be only one product result

    // Structure categories, subcategories, and hashtags as arrays
    product.categories = [{
      id: product.category_id,
      name: product.category_name,
    }];

    product.subcategories = product.subcategory_id ? [{
      id: product.subcategory_id,
      name: product.subcategory_name,
    }] : [];

    product.hashtags = product.hashtag_id ? [{
      id: product.hashtag_id,
      name: product.hashtag_name,
    }] : [];

    // Remove unnecessary fields from the product result
    delete product.category_id;
    delete product.category_name;
    delete product.subcategory_id;
    delete product.subcategory_name;
    delete product.hashtag_id;
    delete product.hashtag_name;

    // Fetch product variations and join with sizes to get size name
    const variationQuery = `
      SELECT pv.size_id, sizes.name AS size_name, pv.color, pv.quantity
      FROM product_variations pv
      LEFT JOIN sizes ON sizes.id = pv.size_id
      WHERE pv.product_id = ?
    `;

    db.query(variationQuery, [productId], (variationErr, variationResults: any) => {
      if (variationErr) {
        return res.status(500).json({ message: "Failed to retrieve product variations", error: variationErr });
      }

      // Add variations with sizes to the product object
      product.variations = variationResults.map((variation: any) => ({
        sizes: [{
          id: variation.size_id,
          name: variation.size_name,
        }],
        color: variation.color,
        quantity: variation.quantity,
      }));

      // Fetch product images
      const imageQuery = `
        SELECT pi.url
        FROM product_images pi
        WHERE pi.product_id = ?
      `;

      db.query(imageQuery, [productId], (imageErr, imageResults) => {
        if (imageErr) {
          return res.status(500).json({ message: "Failed to retrieve product images", error: imageErr });
        }

        product.images = imageResults; // Add images to the product object

        // Return the product with all associated details
        return res.status(200).json(product);
      });
    });
  });
};
