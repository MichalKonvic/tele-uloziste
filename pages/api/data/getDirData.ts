import { NextApiResponse, NextApiRequest } from "next";
import mongoose from 'mongoose';
import { mediaNotFound, serverError } from "../../../lib/apiResponseTemplates";
import dbConnect from "../../../lib/dbConnect";
import getTokenPayload from "../../../lib/tokenValidate";
import dir from "../../../models/dir";
import file from "../../../models/file";
import { breadcrumbI } from "../../../interfaces/DirCards";

async function getBreadcrumbArray(fromId:string) {
    let breadCrumbArray: breadcrumbI[] = [];
    async function processDir(searchId:string) {
        try {
            const dbSearch = await dir.findOne({ _id: searchId });
            if (!dbSearch) return false
            const { _id, name, parent } = dbSearch;
            if (!_id || !name) return false;
            breadCrumbArray.push({
                _id: _id,
                name: name
            });
            if (!dbSearch.parent) return true; // recursion stop
            await processDir(parent);
        } catch (error) {
            return false;
        }
    }
    await processDir(fromId);
    // Push root folder
    breadCrumbArray.push({
        _id: "R",
        name: "Tele Cloud"
    });
    breadCrumbArray.reverse();
    return breadCrumbArray;
}

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
            breadcrumb: [],
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
        //@ts-ignore
        result.files = fileData;
        result.breadcrumb = [{
            //@ts-ignore
            _id: "R",
            //@ts-ignore
            name: "Tele Cloud"
        }]
        res.status(200).json({
            statusCode: 200,
            message: "Data found",
            data: result
        });
        return;
    }
    try {
        // dir check
        const dirDbResult = await dir.findOne({ _id: dirId });
        if (!dirDbResult) throw new Error("Media not found");
    } catch (error) {
        mediaNotFound(res);
        return;
    }

    const result = {
        breadcrumb: [],
        dirs: [],
        files:[]
    };
    const dirData = await dir.findOne({ _id: dirId })
        .select('dirChilds fileChilds')
        .populate({
            path: 'dirChilds',
            select: '_id name description author',
            populate: {
                path: 'author',
                select: "email _id"
            }
        })
        .populate({
            path: 'fileChilds',
            select: '_id name description author onedriveURL',
            populate: {
                path: 'author',
                select: "email _id"
            }
        });
    //@ts-ignore
    result.dirs = dirData.dirChilds;
    //@ts-ignore
    result.files = dirData.fileChilds;
    //@ts-ignore
    result.breadcrumb = await getBreadcrumbArray(dirId);
    if (!result.breadcrumb) {
        serverError(res);
        console.warn(`Broken path to root folder, id:${dirId}`);
        return;
    }
    res.status(200).json({
        statusCode: 200,
        message: "Data found",
        data: result
    });
    return;
}