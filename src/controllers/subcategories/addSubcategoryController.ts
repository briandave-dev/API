import { Request, Response } from "express"; // Import from express
import db from "../../config/db";

interface CategoryRequest {
    category_id: number
    name: string;
    discount: string;
}

export const addSubcategory = (req: Request, res: Response): any => {
    const { category_id, name, discount }: CategoryRequest = req.body; // Correctly type your body
    const query = 'INSERT INTO subcategories(category_id, name, discount) VALUES (?, ?, ?)';

    db.query(query, [category_id, name, discount], (err: any, result: any) => { // Renamed 'res' to 'result'
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(201).json({ message: "Category created successfully", result });
        }
    });
};
