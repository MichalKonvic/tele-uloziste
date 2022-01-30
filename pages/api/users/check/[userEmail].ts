import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/dbConnect";
import user from "../../../../models/user";
type resData = {
    statusCode: number,
    message: string
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<resData> 
) {
    await dbConnect();
    const {userEmail}= req.query;
    if(userEmail === "@teleinformatika.eu") {
        res.status(400).json({
            statusCode: 400,
            message: "Nebyl zadán email"
        })
    }
    // @ts-ignore
    if(!/(.*)\.(.*)@teleinformatika\.eu/.test(userEmail)) {res.status(400).json({
        statusCode: 400,
        message: "Tento účet nelze použít"
    }); return}
    try {
        const exists:boolean = await user.exists({email:userEmail});
        if(exists) res.status(200).json({
            statusCode: 200,
            message: "Uživatel existuje"
        })
        if(!exists) res.status(404).json({
            statusCode: 404,
            message: "Uživatel nenalezen"
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Server error"
        })
    }
}