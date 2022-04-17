import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/user";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const apiKey = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const { email } = req.body;
    if (apiKey !== process.env.API_KEY) {
        res.status(401).send({
            statusCode: 401,
            message: "Špatný API klíč"
        })
        return;
    }
    if (!email) {
        res.status(400).send({
            statusCode: 400,
            message: "Nebyl zadán email"
        })
        return;
    }
    await dbConnect();
    const userData = await User.findOne({ email });
    if (!userData) {
        res.status(404).send({
            statusCode: 404,
            message: "Uživatel nenalezen"
        });
        return;
    }
    res.status(200).json({
        statusCode: 200,
        message: "Uživatel nalezen",
        data: {
            id: userData?._id,
            email: userData?.email,
            updatedAt: userData?.updatedAt,
            lastLoginAt: userData?.lastLoginAt,
            createdAt: userData?.createdAt,
        }
    });
}