import { Request, Response } from "express"; // Import from express
import db from "../../config/db";

interface BillboardRequest {
  url: string;
  name: string;
}

export const addBillboard = (req: Request, res: Response): any => {
  const { name, url }: BillboardRequest = req.body; // Correctly type your body
  const query = 'INSERT INTO billboards(name, url) VALUES (?, ?)';

  db.query(query, [name, url], (err: any, result: any) => { // Renamed 'res' to 'result'
    if (err) {
      return res.status(500).json(err);
    } else {
      return res.status(201).json({ message: "Billboard created successfully", result });
    }
  });
};
