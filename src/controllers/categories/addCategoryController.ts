import { Request, Response } from "express"; // Import from express
import db from "../../config/db";

interface CategoryRequest {
  url: string;
  name: string;
  discount: number;
}

export const addCategory = (req: Request, res: Response): any => {
  const { name, discount, url }: CategoryRequest = req.body; // Correctly type your body
  const query = 'INSERT INTO categories(name, discount, url) VALUES (?, ?, ?)';

  db.query(query, [name, Number(discount), url], (err: any, result: any) => { // Renamed 'res' to 'result'
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(201).json({ message: "Category created successfully", result });
    }
  });
};
