import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JsonWebTokenError, Jwt } from 'jsonwebtoken';
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/user";
type responseDataT = {
    statusCode: number,
    message: string,
    token?: string,
    expiratesAt?: number,
    permissions?: Object
}

type jwtDataT ={
    email: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<responseDataT>
) {
    await dbConnect();
    const { __refresh_token__: refreshToken } = req.cookies;
    if (!refreshToken) {
        res.status(400).json({
            statusCode: 400,
            message: "Refresh token is missing"
        });
        return;
    }
    try {
        const jwtData:jwtDataT|any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, {
            algorithms: ["HS256"]
        });
        if (!jwtData.email) {
            res.status(400).json({
                statusCode: 400,
                message: "Token payload has missing parameters"
            });
            return;
        }
        const user = await User.findOne({ email: jwtData.email });

        if (!user) {
            res.status(404).json({
                statusCode: 404,
                message: "User not found in database"
            });
            return;
        }

        const accessToken = jwt.sign({
            email: user.email,
            permissions: user.permissions
        }, process.env.JWT_ACCESS_SECRET as string, {
            algorithm: "HS256",
            expiresIn: 960
        });
        res.status(200).json({
            statusCode: 200,
            message: "Verified",
            expiratesAt: new Date().setMinutes( new Date().getMinutes() + 15),
            token: accessToken,
            permissions: user.permissions
        })
        return;
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            res.status(401).json({
                statusCode: 401,
                message: "Invalid refresh token"
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