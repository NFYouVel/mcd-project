import { Request, Response } from 'express';
import {Users} from '../models/Users.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

//GET ALL Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error: any) {
    console.error("GET USERS ERROR:", error); // 🔥 ADD THIS
    res.status(500).json({ 
      message: 'Error fetching users',
      error: error.message
    });
  }
};
//Get User by ID 
export const getUserById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string;

        const user = await Users.findByPk(id);

        if(!user){
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            data: user
        })
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// Update User
export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { 
            name, email, password, role,
            address, birth_of_date, salary 
        } = req.body;

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const update: any = {};
        if (name !== undefined) update.name = name;
        if (email !== undefined) update.email = email;
        if (address !== undefined) update.address = address;
        if (birth_of_date !== undefined) update.birth_of_date = birth_of_date;
        if (salary !== undefined) update.salary = salary;
        
        if (role !== undefined) {
            const validRoles = ['manager', 'cashier', 'customer'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid role" });
            }
            update.role = role;
        }

        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        await user.update(update);

        const { password: _, ...userWithoutPassword } = user.toJSON() as any;

        return res.status(200).json({
            message: "User updated",
            data: userWithoutPassword,
        });
    } catch (error: any) {
        return res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { 
            name, email, password, role,
            address, birth_of_date, salary 
        } = req.body;

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const update: any = {};
        if (name !== undefined) update.name = name;
        if (email !== undefined) update.email = email;
        if (address !== undefined) update.address = address;
        if (birth_of_date !== undefined) update.birth_of_date = birth_of_date;
        if (salary !== undefined) update.salary = salary;
        
        if (role !== undefined) {
            const validRoles = ['manager', 'cashier', 'customer'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ message: "Invalid role" });
            }
            update.role = role;
        }

        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        await user.update(update);

        const { password: _, ...userWithoutPassword } = user.toJSON() as any;

        return res.status(200).json({
            message: "User updated",
            data: userWithoutPassword,
        });
    } catch (error: any) {
        return res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
};

//Delete User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const deletedUser = await Users.findByPk(id);

        if(!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await deletedUser.destroy();

        return res.status(200).json({
            message: "User deleted"
        });

    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
}

//LOGIN & REGISTER
export const userLogin = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;


        //1. Search User
        const user = await Users.findOne({where: { email }});
        if (!user) {
            return res.status(404).json({message: "User with that email not found!"});
        }

        //2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid password!"});
        }

        //3. JWT Token
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jwt.sign(
            {
                id: user.getDataValue("id"),
                email: user.getDataValue("email"),
                role: user.getDataValue("role")
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        //4. Response token
        res.json({
            message: "Login successful",
            token
        });
    }
    catch(error){
        console.error("LOGIN ERROR:", error);
        res.status(500).json({message: "Server error during login", error: error instanceof Error ? error.message : String(error)});
    }
}