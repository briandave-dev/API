import db from "../../config/db";
import { Request, Response } from "express";

export const editHashtag = (req: Request, res: Response) => {
    const hashtagId = Number(req.params.id);
    const { name, discount, url } = req.body;

    if (!name || !discount) {
        return res.status(500).json({ message: "Parameter lacking in the body" });
    }

    if (!hashtagId) {
        return res.status(500).json({ message: "No hashtag id provided" });
    }

    const query = 'UPDATE hashtags SET name = ?, discount = ?, url = ? WHERE hashtags.id = ?';
    db.query(query, [name, Number(discount), url, hashtagId], (err: any) => {
        if(err) {
            return res.status(500).json({ message: `Error updating hashtag ${err}` })
        }

        return res.status(200).json({ message: 'Hashtag updated successfully' })
    })
}