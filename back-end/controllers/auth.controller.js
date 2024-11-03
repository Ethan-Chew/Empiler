import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const authLoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'Error',
                message: "Username and Password are required in the request body.",
            });
        }

        const user = await User.getUserWithUsername(username);

        // Check if the User Exists
        if (!user) {
            return res.status(404).json({
                status: 'Error',
                message: `User with username "${username}" not found.`
            });
        }

        // Check if the User's Password is correct
        const checkPasswordMatch = await bcrypt.compare(password, user.password);
        if (!checkPasswordMatch) {
            return res.status(403).json({
                status: 'Error',
                message: "Incorrect Password",
            });
        }

        // Generate JWT Token
        const token = await jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY * 1000
            }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: process.env.JWT_EXPIRY * 1000
        });

        res.status(200).json({
            status: "Success",
            message: "Login Successful",
            accountId: user.id,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const authVerifyToken = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                status: 'Error',
                message: "No Token Provided"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: 'Error',
                    message: "Invalid Token"
                });
            }

            res.status(200).json({
                status: 'Success',
                message: "Token Verified",
                accountId: decoded.id,
                role: decoded.role
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

export default {
    authLoginUser,
    authVerifyToken
}