import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authoriseJWT (req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ 
            error: "Unauthorised",
            message: "Invalid or no JWT"
         });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // // Compare the user's role to an object of routes and their authorised roles
        // const requestedEndpoint = req.url;
        // const userRole = decoded.role;

        // const authorizedRole = Object.entries(authorisedRoles).find(([endpoint, roles]) => {
        //     const regexPattern = endpoint.replace(/:\w+/g, '[^/]+');
        //     const regex = new RegExp(`^${regexPattern}$`);
        //     return regex.test(requestedEndpoint) && roles.includes(userRole);
        // });

        // if (!authorizedRole) {
        //     return res.status(403).json({ message: "Forbidden" });
        // }

        req.user = decoded;
        next();
    });
}