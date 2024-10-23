import { Request, Response } from "express"; // Import from express
import db from "../../config/db";

interface HashtagRequest {
  name: string;
  discount: string;
}

export const addHashtag = (req: Request, res: Response): any => {
  const { name, discount }: HashtagRequest = req.body; // Correctly type your body
  const query = 'INSERT INTO hashtags(name, discount) VALUES (?, ?)';

  db.query(query, [name, discount], (err: any, result: any) => { // Renamed 'res' to 'result'
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(201).json({ message: "Hashtag created successfully", result });
    }
  });
};
