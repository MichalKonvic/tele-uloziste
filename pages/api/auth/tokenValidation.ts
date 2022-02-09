import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { NextApiResponse, NextApiRequest } from "next";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
){
    const { token } = req.body;
    if (!token) {
        res.status(400).json({
            statusCode: 400,
            message: "Token is missing"
        });
        return;
    }
    try {
        const jwtData:any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string, {
            algorithms: ["HS256"]
        });
        res.status(200).json({
            statusCode: 200,
            message: "Token is valid",
        });
        return;
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                statusCode: 401,
                message: "Invalid token"
            })
            return;
        }
        res.status(500).json({
            statusCode: 500,
            message: "Cannot validate refresh token"
        });
        return;
    }
}