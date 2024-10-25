import { Request, Response } from "express";
import db from "../../config/db";

export const getHashtag = (req: Request, res: Response): any => {
    const hashtagId = req.params.id;
    const query = 'SELECT * from hashtags WHERE id = ?';

    if (!hashtagId) {
        return res.status(500).json({ message: "No hashtag id provided" });
    }

    db.query(query, [hashtagId], (err: any, hashtagData: any) => {
        if(err){
            return res.status(500).json({ message: 'Error fetching hashtag' })
        }
        if(hashtagData.length > 0){
            return res.status(200).json({ hashtag: hashtagData[0] })
        }
    })
}