import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db"; // Ensure the path is correct

const salt = 10;

export const getUsers = (req: Request, res: Response): void => {
  const query = "SELECT * from users WHERE ?";

  db.query(query, [true], (err: any, results: any) => {
    if(err){
      return res.json({ message: "Something went wrong"});
    }
    return res.json(results);
  })
}

export const getUserData = (req: Request, res: Response): void => {
  const query = "SELECT * from users WHERE id = ?";
  const { id } = req.query
  if(!id){
    res.json({message: 'Id not specified'})
    return
  }

  db.query(query, [id], (err: any, results: any) => {
    if(err){
      return res.json({ message: "Something went wrong"});
    }
    else if(results.length > 0){
      return res.json(results[0]);
    } else {
      return res.json({message: 'No such user'})
    }
  })
}

export const signup = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  const checkUserSql = "SELECT * FROM users WHERE email = ?";

  db.query(checkUserSql, [email], (err: any, results: any) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length > 0) {
      return res.json({ message: "User already exists" });
    }

    bcrypt.hash(password.toString(), salt, (err: any, hash: string) => {
      if (err) {
        return res.status(500).json(err);
      }
      const sql = "INSERT INTO users (name, email, password) VALUES (?)";
      const values = [name, email, hash];

      db.query(sql, [values], (err: any, data: any) => {
        if (err) {
          return res.status(500).json(err);
        } else {
          return res.status(201).json({ message: "User created successfully", data });
        }
      });
    });
  });
};

export const logout = (req: Request, res: Response): Response => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' }); // Adjust attributes as needed
  res.clearCookie('userData', { httpOnly: true, sameSite: 'lax' }); // Adjust attributes as needed
  res.clearCookie('userId', { httpOnly: true, sameSite: 'lax' }); // Adjust attributes as needed

  // Optionally clear additional cookies
  // res.clearCookie('anotherCookie');

  return res.status(200).json({ message: 'Logged out successfully' });
};

export const login = (req: Request, res: Response): void => {
  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.query(sql, [req.body.email], (err: any, data: any) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err: any, response: boolean) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (response) {
          const id = data[0].id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1y' });
          
          // Set cookie without secure flag for development
          res.cookie('token', token, {
            httpOnly: true, // Not accessible via JavaScript
            sameSite: 'lax', // Adjust for development
            maxAge: 365 * 24 * 60 * 60 * 1000 // One year
          });

          res.cookie('userId', data[0].id, {
            httpOnly: true, // Not accessible via JavaScript
            sameSite: 'lax', // Adjust for development
            maxAge: 365 * 24 * 60 * 60 * 1000 // One year
          });
          
          return res.json({ Login: true, token, userData: data[0] });
        }
        return res.json({ Login: false });
      });
    } else {
      return res.json("Failed");
    }
  });
};

// export const login = (req: Request, res: Response): void => {
//   const sql = "SELECT * FROM users WHERE email = ?";
//   db.query(sql, [req.body.email], (err: any, data: any) => {
//     if (err) {
//       return res.status(500).json(err);
//     }
//     if (data.length > 0) {
//       bcrypt.compare(req.body.password.toString(), data[0].password, (err: any, response: boolean) => {
//         if (err) {
//           return res.status(500).json(err);
//         }
//         if (response) {
//           const id = data[0].id;
//           const token = jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: 300 });
//           res.cookie('token', token);
//           return res.json({ Login: true, token, userData: data[0] });
//         }
//         return res.json({ Login: false });
//       });
//     } else {
//       return res.json("Failed");
//     }
//   });
// };

export const checkAuth = (req: Request, res: Response) => {
  return res.json("Authenticated");
};
