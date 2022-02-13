import { NextApiRequest, NextApiResponse } from "next";
type resDataT ={
    statusCode: number,
    message: string
}
export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse<resDataT>
) {
    // FIXME TODO  add "Secure;" into response token will be send only if server is https
    res.setHeader('Set-Cookie', `__refresh_token__=; Expires=-1; SameSite=Strict; HttpOnly; Path=/`);
    res.status(200).json({
        statusCode: 200,
        message: "Odhlášen"
    });
}