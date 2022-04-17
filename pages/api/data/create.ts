import { NextApiResponse, NextApiRequest } from "next";
import { serverURL } from "../../../config";
import { mediaCreated, serverError } from "../../../lib/apiResponseTemplates";
import dbConnect from "../../../lib/dbConnect";
import getTokenPayload from "../../../lib/tokenValidate";
import dir from "../../../models/dir";
import file from "../../../models/file";
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
        try {
            const parentSearchResult = await dir.findOne({ _id: parent });
            if (!parentSearchResult) {
                // Parent not found
                res.status(404).json({
                    statusCode: 404,
                    message: "Parent not found"
                });
                return;
            }
        } catch (error) {
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
        // Template response
        mediaCreated(res);
        return;
    }
    if (saveType === "FILE") {
        try {
            const NewFile = new file({
                name: name,
                description: description,
                onedriveURL: "//TODO pass link",
                authorId: id,
                parent: parent,
                updatedAt: Date()
            });
            await NewFile.save();
        } catch (error) {
            // TODO handle specific errors
            res.status(500).json({
                statusCode: 500,
                message: "Cannot save file into database"
            });
        }
        // Template response
        mediaCreated(res);
        return;
    }
}