import { NextApiResponse, NextApiRequest } from "next";
import mongoose from 'mongoose';
import { serverURL } from "../../../config";
import { mediaCreated, mediaDeleted, serverError } from "../../../lib/apiResponseTemplates";
import dbConnect from "../../../lib/dbConnect";
import getTokenPayload from "../../../lib/tokenValidate";
import dir from "../../../models/dir";
import file from "../../../models/file";

/**
 * Recursively deletes file and its childs
 * @param dirId database dir _id
 * @returns If deletion was sucessful
 */
async function deleteDirAndChilds(dirId:string) {
    try {
        const deletedDirData = await dir.findOneAndDelete({ _id: dirId });
        if (deletedDirData?.fileChilds[0]) {
            // Dir had file childs
            await file.deleteMany({ parent: dirId });
        }
        if (deletedDirData?.dirChilds[0]) {
            // Dir had dir childs
            for (let childDirId of deletedDirData.dirChilds) {
                const deletionResult = await deleteDirAndChilds(childDirId);
                // Stops recursion if error occured
                if (!deletionResult) throw new Error(`Error occured while deleting dir "${childDirId}"`);
            }
        }
    } catch (error) {
        console.error(`Error occured while deleting dir: ${dirId}`);
        return false;
    }
    return true
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Establish database connection
    await dbConnect();
    // Request data filter
    const { token, data } = req.body;
    const {type: mediaType, mediaId } = data;
    //#region Body data checks
    if (!token) {
        res.status(400).json({
            statusCode: 400,
            message: "Token is missing"
        });
        return;
    }
    if (!mediaId || !mediaType) {
        res.status(400).json({
            statusCode: 400,
            message: "Missing data"
        });
        return;
    }
    if (mediaType !== "DIR" && mediaType !== "FILE") {
        res.status(400).json({
            statusCode: 400,
            message: `Invalid type, should be 'DIR' or 'FILE' not '${mediaType}'`
        });
        return;
    }
    //#endregion
    
    // Auth check
    const tokenEmail = getTokenPayload(token);
    if (!tokenEmail) {
        res.status(401).json({
            statusCode: 401,
            message: "Unauthorized"
        });
        return;
    }
    
    //#region Obtain user data from db request
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

    //#region Response checks
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
    //#endregion
    
    // User data from database
    const { id } = getUserResponse?.data;
    //#endregion

    if (mediaType === "DIR") {
        // delete dir from parent
        try {
            const dbDir = await dir.findOne({ _id: mediaId });
            if (dbDir?.parent) {
                const dirParent = await dir.findOne({ _id: dbDir.parent });
                dirParent.dirChilds = dirParent.dirChilds.filter((childId:mongoose.Types.ObjectId) => childId.toString() !== mediaId);
                await dirParent.save();
            }
        } catch (error) {
            serverError(res);
            return;
        }
        const deletionStatus = await deleteDirAndChilds(mediaId);
        if (!deletionStatus) {
            serverError(res);
            console.error(`Error occured while deleting dir: ${mediaId}`);
            return;
        }
        // Template response
        mediaDeleted(res);
        return;
    }
    if (mediaType === "FILE") {
        try {
            const deletedFile = await file.findOneAndDelete({ _id: mediaId });
            if (deletedFile?.parent) {
                const parentDir = await dir.findOne({ _id: deletedFile.parent });
                parentDir.fileChilds = parentDir.fileChilds.filter((childId:mongoose.Types.ObjectId) => childId.toString() !== mediaId);
                await parentDir.save();
            }
        } catch (error) {
            console.log(error)
            serverError(res);
            return;
        }
        // Template response
        mediaDeleted(res);
        return;
    }
    serverError(res);
    return;
}