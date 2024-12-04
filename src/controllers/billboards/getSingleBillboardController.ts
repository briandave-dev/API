import { Request, Response } from "express";
import db from "../../config/db";

export const getBillboard = (req: Request, res: Response): any => {
    const billboardId = req.params.id;
    const query = 'SELECT * from billboards WHERE id = ?';

    if (!billboardId) {
        return res.status(500).json({ message: "No billboard id provided" });
    }

    db.query(query, [billboardId], (err: any, billboardData: any) => {
        if(err){
            return res.status(500).json({ message: 'Error fetching billboard' })
        }
        if(billboardData.length > 0){
            return res.status(200).json({ billboard: billboardData[0] })
        }
    })
}