import db from "../../config/db";
import { Request, Response } from "express";

export const editCategory = (req: Request, res: Response) => {
    const categoryId = Number(req.params.id);
    const { name, discount } = req.body;

    if (!name || !discount) {
        return res.status(500).json({ message: "Parameter lacking in the body" });
    }

    if (!categoryId) {
        return res.status(500).json({ message: "No category id provided" });
    }

    const query = 'UPDATE categories SET name = ?, discount = ? WHERE categories.id = ?';
    db.query(query, [name, Number(discount), categoryId], (err: any) => {
        if(err) {
            return res.status(500).json({ message: `Error updating category ${err}` })
        }

        return res.status(200).json({ message: 'Category updated successfully' })
    })
}