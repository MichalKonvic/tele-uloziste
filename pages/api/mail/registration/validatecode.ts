// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import cache from '../../../../lib/cache';
type Data = {
    message:string,
    statusCode:number
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const parsedBody: {uID:string,regCode: string} = JSON.parse(req.body);
        const serverRegCode:string|undefined = cache.find(parsedBody.uID)?.data || undefined;
        const clientRegCode:string|undefined = parsedBody.regCode || undefined;
        if (!clientRegCode) {
            res.status(400).json({ message: "Nebyl zadán kód", statusCode: 400 });
            return;
        }
        if (!serverRegCode) {
            res.status(410).json({ message: "Kód nexistuje", statusCode: 410 });
            return;
        }
        if (serverRegCode === clientRegCode) {
            res.status(200).json({ message: "Authorizován", statusCode: 200 });
            return;
        }
        if (serverRegCode !== clientRegCode) {
            res.status(401).json({ message: "Neautorizován", statusCode: 401 });
            return;
        }
        res.status(500).json({ message: "Checks failed", statusCode: 500 });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Nelze načíst tělo requestu",statusCode:500});
    }
}
