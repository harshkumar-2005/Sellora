import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const isAuthenticated = (req, res, next) => {
    try {
        const headerToken = req.headers.authorization.split(" ")[1];

        if (!headerToken) {
            return res.status(401).json({
                'sucess': false,
                'message': 'Unauthorized : No Token Provided'
            })
        }
        const isVerified = jwt.verify(headerToken, JWT_SECRET);
        if (!isVerified) {
            return res.status(401).json({
                sucess: false,
                message: 'Token is invalid or expired'
            })
        }
        req.user = isVerified;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            sucess: false,
            message: 'Token is invalid or expired'
        });
    }
}
