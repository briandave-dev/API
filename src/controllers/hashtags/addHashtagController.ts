import { Request, Response } from "express"; // Import from express
import db from "../../config/db";

interface HashtagRequest {
  url: string;
  name: string;
  discount: number;
}

export const addHashtag = (req: Request, res: Response): any => {
  const { name, discount, url }: HashtagRequest = req.body; // Correctly type your body
  const query = 'INSERT INTO hashtags(name, discount, url) VALUES (?, ?, ?)';

  db.query(query, [name, Number(discount), url], (err: any, result: any) => { // Renamed 'res' to 'result'
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(201).json({ message: "Hashtag created successfully", result });
    }
  });
};
