import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/user";
import {hash} from 'bcryptjs';

type resDataT ={
    statusCode: number,
    message: string,
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
        const user = new User({ email: parsedBody.userEmail, password: await hash(parsedBody.password, 10) });
        await user.save();
        res.status(201).json({
            statusCode: 201,
            message: "Uživatel zaregistrován"
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Došlo k problému"
        });
    }
}