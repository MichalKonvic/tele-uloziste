import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/user";
import {compare} from 'bcryptjs';
import generateRefreshToken from "../../../lib/genRefreshToken";

type resDataT ={
    statusCode: number,
    message: string,
    token?: string
}

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse<resDataT>
){
    await dbConnect();
    let parsedBody = {
        userEmail: "",
        password: ""
    }

    try {
        parsedBody = JSON.parse(req.body);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Nelze převést tělo requestu"
        })
        return;
    }

    if (!parsedBody.userEmail || !parsedBody.password) {
        res.status(400).json({
            statusCode: 400,
            message: "Chybí parametry"
        })
        return;
    }
    
    try {
        const userSearchResult = await User.findOne({ email: parsedBody.userEmail });
        if (!userSearchResult) {
            res.status(404).json({
                statusCode: 404,
                message: "Uživatel nenalezen"
            });
            return;
        }
        if (!await compare(parsedBody.password, userSearchResult.password)) {
            res.status(401).json({
                statusCode: 401,
                message: "Špatné heslo"
            });
            return;
        }
        // Save user login
        await User.findOneAndUpdate({ email: parsedBody.userEmail }, { updatedAt: Date(), lastLoginAt: Date() });
        const refreshToken = generateRefreshToken(parsedBody.userEmail);
        const expirationDate = new Date();
        expirationDate.setMonth((new Date().getMonth() + 1));
        // FIXME TODO  add "Secure;" into response token will be send only if server is https
        res.setHeader('Set-Cookie', `__refresh_token__=${refreshToken}; Expires=${expirationDate}; SameSite=Strict; HttpOnly; Path=/`);
        res.status(200).json({
            statusCode: 200,
            message: "Přihlášen"
        })
        return;
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        });
    }
}