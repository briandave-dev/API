import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db"; // Adjust the path as necessary

export const checkApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers["api-key"] as string; // Cast to string
  if (!apiKey) {
    res.status(401).json("API key is required");
    return;
  }

  const sql = "SELECT * FROM api_key WHERE id = 1";
  db.query(sql, (err: Error | null, result: any) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (result.length === 0 || result[0].api_key !== apiKey) {
      return res.status(403).json("Invalid API key");
    }
    next();
  });
};

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["access-token"] as string; // Cast to string
  // const token =  req.cookies.token as string
  if (!token) {
    return res.status(401).json("Your session token has been deleted. Please login again.");
  } else {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json("Your session token has expired. Please login again.");
      } else {
        (req as any).userId = (decoded as { id: number }).id; // Cast req to any to allow adding userId
        // res.status(200).json({ userId: `${(req as any).userId }`})
        next();
      }
    });
  }
};
