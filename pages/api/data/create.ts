import { NextApiResponse, NextApiRequest } from "next";
import { serverURL } from "../../../config";
import { serverError } from "../../../lib/apiResponseTemplates";
import dbConnect from "../../../lib/dbConnect";
import getTokenPayload from "../../../lib/tokenValidate";
import dir from "../../../models/dir";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await dbConnect();
    const { token, data: Dir } = req.body;
    const { parent, name, description, type: saveType } = Dir;
    if (!token) {
        res.status(400).json({
            statusCode: 400,
            message: "Token is missing"
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
    if (!name || !description || !saveType) {
        res.status(400).json({
            statusCode: 400,
            message: "Missing data"
        });
        return;
    }
    if (saveType !== "DIR" && saveType !== "FILE") {
        res.status(400).json({
            statusCode: 400,
            message: `Invalid type, should be 'DIR' or 'FILE' not '${saveType}'`
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
    // User data from database
    const { id, email } = getUserResponse?.data;
    // Parent check
    if (parent) {
        // DB query
        const parentSearchResult = await Dir.findById(parent);
        if (!parentSearchResult) {
            // Parent not found
            res.status(404).json({
                statusCode: 404,
                message: "Parent not found"
            });
            return;
        }
        // Parent found
        // TODO Create directory and file with parent
    }
    // Files are saved into root folder
    if (saveType === "DIR") {
        // No parent directory folder save
        const NewDir = new dir({
            name: name,
            description: description,
            authorId: id,
            updatedAt: Date()
        });
        await NewDir.save();
    }
    // TODO No parent file save
}