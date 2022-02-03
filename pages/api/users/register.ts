import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/user";
import {hash} from 'bcryptjs';
import cache from "../../../lib/cache";

type resDataT ={
    statusCode: number,
    message: string,
    token?: string
}

interface cacheDataI{
    registrationCode: string,
    registrationEmail: string,
    isValidated: boolean
}

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse<resDataT>
){
    await dbConnect();
    let parsedBody = {
        userEmail: "",
        password: "",
        uID: ""
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

    const cacheData:cacheDataI = cache.find(parsedBody.uID);

    if (!parsedBody.userEmail || !parsedBody.password || !parsedBody.uID) {
        res.status(400).json({
            statusCode: 400,
            message: "Chybí parametry"
        })
        return;
    }
    if (!cacheData) {
        res.status(410).json({
            statusCode: 410,
            message: "Registrace vypršela"
        })
        return;
    }
    if (!cacheData?.isValidated) {
        res.status(401).json({
            statusCode: 401,
            message: "Registrace nebyla ověřena"
        })
        return
    }
    if (!cacheData?.registrationEmail) {
        res.status(409).json({
            statusCode: 409,
            message: "Emaily se neshodují"
        })
        return
    }

    try {
        //TODO add jwt token
        const user = new User({ email: parsedBody.userEmail, password: await hash(parsedBody.password, 10),updatedAt: Date(), lastLoginAt: Date() });
        await user.save();
        res.status(201).json({
            statusCode: 201,
            message: "Uživatel zaregistrován",
            token: "sfsd"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        });
    }
}