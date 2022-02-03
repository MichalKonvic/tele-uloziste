

import type { NextApiRequest, NextApiResponse } from "next";
import { serverURL } from "../../../config";
import dbConnect from "../../../lib/dbConnect";
import user from "../../../models/user";
type resData = {
    statusCode: number,
    message: string,
    cacheUID?: string
}
interface reqBodyI{
    userEmail: string
}
interface emailRegistrationBodyI{
    statusCode: number,
    message: string,
    cacheUID?:string
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<resData> 
) {
    await dbConnect();
    let userEmail = "";
    try {
        const parsedRequestBody:reqBodyI = JSON.parse(req.body);
        userEmail = parsedRequestBody.userEmail;
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        });
        return;
    }


    if(userEmail === "@teleinformatika.eu" ||!userEmail) {
        res.status(400).json({
            statusCode: 400,
            message: "Nebyl zadán email"
        });
        return;
    }
    // @ts-ignore
    if (!/(.*)\.(.*)@teleinformatika\.eu/.test(userEmail)) {
        res.status(400).json({
        statusCode: 400,
        message: "Tento účet nelze použít"
        });
        return
    }
    try {
        const exists:boolean = await user.exists({email:userEmail});
        if (exists) {
            res.status(200).json({
                statusCode: 200,
                message: "Uživatel existuje"
            });
            return;
        }
        // REGISTRATION REQUEST
        const registrationReqResponse:emailRegistrationBodyI = await (await fetch(`${serverURL}/api/mail/registration/sendcode`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
            },
            body: JSON.stringify({
            sendToEmail: userEmail
        })
        })).json();

        if (registrationReqResponse.cacheUID) {
            res.status(404).json({
                statusCode: 404,
                message: "Uživatel nenalezen",
                cacheUID: registrationReqResponse.cacheUID
            });
            return;
        }
        if (registrationReqResponse.statusCode === 401) {
            console.error("Server has invalid API key");
            throw new Error("Invalid API key");
        }
        throw new Error("API request failed");
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        })
        return;
    }
}