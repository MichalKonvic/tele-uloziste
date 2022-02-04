import { NextApiRequest, NextApiResponse } from "next";
type resDataT ={
    statusCode: number,
    message: string
}
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse<resDataT>
){
    res.setHeader('Set-Cookie', `__refresh_token__=; Expires=${new Date()}; SameSite=Strict; Secure; HttpOnly`);
    res.status(200).json({
        statusCode: 200,
        message: "Odhlášen"
    });
}