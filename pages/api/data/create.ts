import { NextApiResponse, NextApiRequest } from "next";
import { serverURL } from "../../../config";
import Data from "../../../models/data";
import { serverError } from "../../../lib/apiResponseTemplates";
import dbConnect from "../../../lib/dbConnect";
import getTokenPayload from "../../../lib/tokenValidate";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
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
    const tokenEmail = getTokenPayload(token);
    if (!tokenEmail) {
        res.status(401).json({
            statusCode: 401,
            message: "Unauthorized"
        });
        return;
    }
    // Obtain user data from db request
    const getUserResponse = await (await fetch(`${serverURL}/api/db/getUser`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
            'Content-type':"application/json"
        },
        body: JSON.stringify({
            email: tokenEmail
        })
    })).json();
    if (getUserResponse?.statusCode !== 200) {
        if (getUserResponse?.statusCode === 404) {
            res.status(404).json({
                statusCode: 404,
                message: "Uživatel nebyl nalezen v databázi"
            });
            return;
        }
        if (getUserResponse?.statusCode === 401) {
            console.error("Špatný API klíč (Zkontrolujte .env soubor)");
        }
        serverError(res);
        return;
    }
    if (!getUserResponse?.data) {
        serverError(res);
        return;
    }
    const { id, email } = getUserResponse?.data;
    // TODO create database data
    
}