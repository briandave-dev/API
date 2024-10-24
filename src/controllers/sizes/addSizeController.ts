import { Request, Response } from "express"; // Import from express
import db from "../../config/db";

interface SizeRequest {
    category_id: number
    name: string;
}

export const addSize = (req: Request, res: Response): any => {
    const { category_id, name }: SizeRequest = req.body; // Correctly type your body
    const query = 'INSERT INTO sizes(category_id, name) VALUES (?, ?)';

    db.query(query, [category_id, name], (err: any, result: any) => { // Renamed 'res' to 'result'
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(201).json({ message: "Size created successfully", result });
        }
    });
};
