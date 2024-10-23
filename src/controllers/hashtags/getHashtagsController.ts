import { Request, Response } from "express";
import db from "../../config/db";

// Interface for the product response
interface HashtagResponse {
  id: number;
  name: string;
  discount: number;
}

export const getHashtags = (req: Request, res: Response): any => {
  const query = `SELECT * from hashtags`;

  db.query(query, (err: any, results: HashtagResponse[]) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch hashtags", error: err });
    }

    return res.status(200).json({ hashtags: results });
  });
};