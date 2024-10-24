import { Request, Response } from "express";
import db from "../../config/db";

// Interface for the product response
interface SubcategoryResponse {
  id: number;
  category_name: number;
  name: string;
  discount: number;
}

export const getSubcategories = (req: Request, res: Response): any => {
  const query = `SELECT subcategories.id, subcategories.name AS name, subcategories.discount, categories.name 
  AS category_name, categories.id as category_id from subcategories JOIN categories ON subcategories.category_id = categories.id`;

  db.query(query, (err: any, results: SubcategoryResponse[]) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch subcategories", error: err });
    }

    return res.status(200).json({ subcategories: results });
  });
};