import db from "../../config/db";
import { Request, Response } from "express";

export const editBillboard = (req: Request, res: Response) => {
    const billboardId = Number(req.params.id);
    const { name, url } = req.body;

    if (!name || !url) {
        return res.status(500).json({ message: "Parameter lacking in the body" });
    }

    if (!billboardId) {
        return res.status(500).json({ message: "No billboard id provided" });
    }

    const query = 'UPDATE billboards SET name = ?, url = ? WHERE billboards.id = ?';
    db.query(query, [name, url, billboardId], (err: any) => {
        if(err) {
            return res.status(500).json({ message: `Error updating billboard ${err}` })
        }

        return res.status(200).json({ message: 'Billboard updated successfully' })
    })
}