import { NextApiResponse, NextApiRequest } from "next";
import mongoose from 'mongoose';
import { serverURL } from "../../../config";
import { mediaCreated, serverError } from "../../../lib/apiResponseTemplates";
import dbConnect from "../../../lib/dbConnect";
import getTokenPayload from "../../../lib/tokenValidate";
import dir from "../../../models/dir";
import file from "../../../models/file";
import { v2directoryI } from "../../../interfaces/DirCards";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Establish database connection
    await dbConnect();
    // Request data filter
    const { token, dirId } = req.body;
    //#region Body data checks
    if (!token) {
        res.status(400).json({
            statusCode: 400,
            message: "Token is missing"
        });
        return;
    }
    // Auth check
    const tokenEmail = getTokenPayload(token);
    if (!tokenEmail) {
        res.status(401).json({
            statusCode: 401,
            message: "Unauthorized"
        });
        return;
    }
    if (!dirId) {
        // returns root folder if no dirId
        const result = {
            breadcrumb: []
            dirs: [],
            files:[]
        };
        const dirData = await dir.find({ parent: { $exists: false } })
            // .populate('dirChilds','_id name description author')
            // .populate('fileChilds','_id name description author onedriveURL')
            .populate('author','email')
            .select("_id name description")
        //@ts-ignore
        result.dirs = dirData;
        const fileData = await file.find({ parent: { $exists: false } })
            .populate('author', 'email')
            .select('_id name description onedriveURL');
        result.files = fileData;
        // TODO add breadcrumb
        
        res.send(result);
        return;
    }

}