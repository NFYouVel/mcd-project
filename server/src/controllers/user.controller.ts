import { Request, Response } from 'express';
import {Users} from '../models/Users.js';


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

//Create User
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, address, birth_of_date } = req.body;

        const newUser = await Users.create({
            name,
            email,
            password,
            address,
            birth_of_date
        });

        return res.status(201).json({
            message: "User created",
            data: newUser
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
}

//Update User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, email, password, address, birth_of_date } = req.body;
        const updatedUser = await Users.findByPk(id);

        if(!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await updatedUser.update({
            name,
            email,
            password,
            address,
            birth_of_date  
        })

        return res.status(200).json({
            message: "User updated",
            data: updatedUser
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        });
    }
}

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