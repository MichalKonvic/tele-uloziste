import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {userEmail} = req.query;
    // TODO check if user exist
    res.end(`Testing: ${userEmail}`);
}