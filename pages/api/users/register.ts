import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import user from "../../../models/user";

type Data ={
    statusCode: number,
    message: string,
}

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
){
    await dbConnect();

}