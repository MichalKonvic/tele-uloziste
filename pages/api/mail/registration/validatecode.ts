// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import cache from '../../../../lib/cache';
type responseDataT = {
    message:string,
    statusCode:number
}
interface cacheDataI{
    registrationCode: string,
    registrationEmail: string,
    isValidated: boolean
}
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<responseDataT>
) {
    try {
        const parsedBody: {uID:string,regCode: string} = JSON.parse(req.body);
        const cacheData: cacheDataI = cache.find(parsedBody.uID);
        const clientRegCode:string|undefined = parsedBody.regCode || undefined;
        if (!clientRegCode) {
            res.status(400).json({ message: "Nebyl zadán kód", statusCode: 400 });
            return;
        }
        if (!cacheData) {
            res.status(410).json({ message: "Kód nexistuje", statusCode: 410 });
            return;
        }
        if (cacheData.registrationCode === clientRegCode) {
            cacheData.isValidated = true;
            cache.setData(parsedBody.uID, cacheData);
            res.status(200).json({ message: "Authorizován", statusCode: 200 });
            return;
        }
        res.status(401).json({ message: "Neautorizován", statusCode: 401 });
        return;
    } catch (error) {
        res.status(500).json({message:"Nelze načíst tělo requestu",statusCode:500});
    }
}
