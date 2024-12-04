import { Request, Response } from "express";
import db from "../../config/db";

// Interface for the product response
interface BillboardResponse {
  id: number;
  name: string;
  image: string;
}

export const getBillboards = (req: Request, res: Response): any => {
  const query = `SELECT * from billboards`;

  db.query(query, (err: any, results: BillboardResponse[]) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch billbaords", error: err });
    }

    return res.status(200).json({ billboards: results });
  });
};