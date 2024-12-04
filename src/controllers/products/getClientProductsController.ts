import { Request, Response } from "express";
import db from "../../config/db";

// Interface for the product response
interface ProductResponse {
  id: number;
  title: string;
  price: number;
  discount: number;
  category_name: string;
  subcategory_name: string | null;
  is_archived: boolean;
  created_at: string;
  total_quantity: number;
}

export const getClientProducts = (req: Request, res: Response): any => {
  const query = `
    SELECT 
      p.id,
      p.title,
      p.price,
      p.discount,
      p.main_image,
      p.is_archived,
      p.created_at,
      c.name AS category_name,
      sc.name AS subcategory_name,
      h.name AS hashtag_name,
      (
        SELECT SUM(pv.quantity)
        FROM product_variations pv
        WHERE pv.product_id = p.id
      ) AS total_quantity
    FROM products p
    LEFT JOIN hashtags h ON p.hashtag_id = h.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    WHERE is_archived = false
  `;

  db.query(query, (err: any, results: ProductResponse[]) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch products", error: err });
    }

    return res.status(200).json({ products: results });
  });
};
