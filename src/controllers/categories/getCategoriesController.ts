import { Request, Response } from "express";
import db from "../../config/db";

// Interface for the product response
interface CategoryResponse {
  id: number;
  name: string;
  discount: number;
}

export const getCategories = (req: Request, res: Response): any => {
  const query = `SELECT * from categories`;

  db.query(query, (err: any, results: CategoryResponse[]) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch categories", error: err });
    }

    return res.status(200).json({ categories: results });
  });
};