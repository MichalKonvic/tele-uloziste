import { NextApiResponse, NextApiRequest } from "next";
import isTokenValid from "../../../lib/tokenValidate";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token, data } = req.body;
    if (!token) {
        res.status(400).json({
            statusCode: 400,
            message: "Token is missing"
        });
        return;
    }
    if (!data) {
        res.status(400).json({
            statusCode: 400,
            message: "Missing data"
        });
        return;
    }
    const isValid = isTokenValid(token);
    if (!isValid) {
        res.status(401).json({
            statusCode: 401,
            message: "Unauthorized"
        });
        return;
    }
    // TODO create database data
    
}