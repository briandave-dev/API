import { Request, Response } from "express";
import db from "../../config/db";

export const getCategory = (req: Request, res: Response): any => {
    const categoryId = req.params.id;
    const query = 'SELECT * from categories WHERE id = ?';

    if (!categoryId) {
        return res.status(500).json({ message: "No category id provided" });
    }

    db.query(query, [categoryId], (err: any, categoryData: any) => {
        if(err){
            return res.status(500).json({ message: 'Error fetching category' })
        }
        if(categoryData.length > 0){
            return res.status(200).json({ category: categoryData[0] })
        }
    })
}