import { Request, Response } from "express";
import db from "../../config/db";

// Interface for the product response
interface SizeResponse {
  id: number;
  category_name: number;
  name: string;
}

export const getSizes = (req: Request, res: Response): any => {
  const query = `SELECT sizes.id, sizes.name AS name, categories.name 
  AS category_name from sizes JOIN categories ON sizes.category_id = categories.id`;

  db.query(query, (err: any, results: SizeResponse[]) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch sizes", error: err });
    }

    return res.status(200).json({ sizes: results });
  });
};