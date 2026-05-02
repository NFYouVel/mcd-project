import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Users } from "../models/Users.js";

// LOGIN
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET as string, { expiresIn: "1d" });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, role: user.role, name: user.name }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// FORGET PASSWORD
export const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(200).json({
                message: "If email exists, reset link will be sent"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = new Date(Date.now() + 3600000); // 1 jam

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Di production kirim email. Untuk tugas, return aja tokennya
        return res.status(200).json({
            message: "Reset token generated",
            resetToken,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        const user = await Users.findOne({
            where: { resetPasswordToken: token }
        });

        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};